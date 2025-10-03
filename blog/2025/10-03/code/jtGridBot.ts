import { globals } from './lib/core/globals';
import { currentTime, timeCurrent, timeToString } from './lib/utils/date-time';
import { error, errorOnce, log, logOnce, trace, warning } from './lib/core/log';
import { sleep } from './lib/utils/misc';
import { BaseScript } from './lib/script/base-script';
import { getArgNumber, getArgString } from './lib/core/base';
import { StandardReportLayout } from './lib/report/layouts';
import { OrdersBasket } from './lib/exchange';
import { ExchangeParams } from './lib/exchange/types';
import { BaseError } from './lib/core/errors';
import { longProfit } from './lib/exchange/heplers';
import { max, percentDifference, round } from './lib/utils/numbers';

export class JtGridBot extends BaseScript {
  static definedArgs = [
    {
      key: 'symbols',
      mode: 'runtime',
      defaultValue:
        'ADA/USDT:USDT,XRP/USDT:USDT,TRX/USDT:USDT,BNB/USDT:USDT,DOGE/USDT:USDT,AVAX/USDT:USDT,LINK/USDT:USDT',
      filters: {
        volume: { min: 500000 },
        leverage: { min: 20 },
        maxSymbols: 10,
        autoSelect: 10,
      },
    },
    {
      key: 'symbols',
      defaultValue: 'BCH/USDT,BTC/USDT,ADA/USDT,ETH/USDT,XRP/USDT,TRX/USDT,SOL/USDT,LTC/USDT,BNB/USDT,DOGE/USDT',
      mode: 'tester',
    },
    {
      key: 'sizeUsd',
      defaultValue: 100,
      mode: 'tester',
    },
    {
      key: 'sizeUsd',
      defaultValue: 10,
      mode: 'runtime',
    },
    {
      key: 'gridStepPercent',
      defaultValue: 10,
    },
    {
      key: 'tpPercent',
      defaultValue: 1,
    },
    {
      key: 'sizeFactor',
      defaultValue: 1,
    },
  ];
  baskets: Record<string, DynamicGridBasket> = {};
  basketClass = DynamicGridBasket;
  private reportLayout: StandardReportLayout = new StandardReportLayout();

  constructor(args: GlobalARGS) {
    const coins = getArgString('coins', '');
    if (coins.length > 0) {
      for (const coin of coins.split(',')) {
        ARGS.symbols += coin.trim().toUpperCase() + '/USDT:USDT,';
      }
      warning('BasketRunner::constructor', 'Symbols set automatically', { symbols: ARGS.symbols }, true);
    }
    super(args);
  }

  async onInit() {
    await super.onInit();

    await this.reportLayout.init();

    globals.triggers.addTaskByTime({
      callback: this.createBaskets,
      triggerTime: currentTime() + 1000,
      name: 'createBaskets',
    });
  }
  isBasketsCreated = false;
  // Create a basket for each symbol
  createBaskets = async () => {
    if (this.isBasketsCreated) return;

    log('Strategy::createBaskets', 'Creating baskets for symbols:', this.symbols, true);
    for (const symbol of this.symbols) {
      await this.createBasket(symbol);
    }

    this.isBasketsCreated = true;
    await sleep(1000); // Sleep to avoid rate limits
    // this.setPerformance();
  };

  createBasket = async (symbol: string) => {
    if (this.baskets[symbol]) {
      warning('BasketRunner::createBasket', 'Basket already exists for symbol:', { symbol });
      return;
    }

    this.baskets[symbol] = new this.basketClass({
      symbol,
      connectionName: this.connectionName,
      onTickInterval: 60 * 1000,
      leverage: 30,
    });

    await this.baskets[symbol].init();
    await sleep(1000); // Sleep to avoid rate limits
  };
}

class DynamicGridBasket extends OrdersBasket {
  sizeUsd: number = getArgNumber('sizeUsd', 10);
  gridStepPercent = getArgNumber('gridStepPercent', 10);
  tpPercent = getArgNumber('tpPercent', 2); // 10%
  sizeFactor = getArgNumber('sizeFactor', 1); // 1

  maxDrawdownPercent = getArgNumber('maxDrawdownPercent', 400000) / 100; // 10%
  basketId = 0;
  MIN_LEVERAGE = 15;
  private isStopped: boolean;

  constructor(params: ExchangeParams) {
    super(params);
  }
  initErrors = [];
  async init() {
    try {
      await super.init();
    } catch (e) {
      error(e);
      this.initErrors.push(e.message);
    }

    log(
      'stdGridBasket::init',
      'Initializing grid basket for symbol:',
      {
        symbol: this.symbol,
        usdSize: this.sizeUsd,
        gridStepPercent: this.gridStepPercent,
        tpPercent: this.tpPercent,
        sizeFactor: this.sizeFactor,
      },
      true,
    );

    if (this.isInit) {
      const orders = await this.getOpenOrders();

      const position = await this.getPositionBySide('long');
      //if no position, that means a new round is starting
      if (position.contracts === 0) {
        let taskName = 'newRound';
        this.triggerService.registerTimeHandler(taskName, this.newRound, this);
        this.triggerService.addTaskByTime({
          triggerTime: timeCurrent() + 60 * 100,
          name: taskName,
          comment: this.symbol,
        });
      }

      if (orders.length === 0 && position.contracts > 0) {
        this.triggerService.addTaskByTime({
          callback: this.createLimitByStep.bind(this),
          triggerTime: timeCurrent() + 60 * 1000,
          name: 'createLimitByStepInit' + this.symbol,
          comment: this.symbol,
        });
      }
      //MBOX/USDT:USDT,DOGS/USDT:USDT,OM/USDT:USDT,BLUR/USDT:USDT,ZK/USDT:USDT

      if (!isTester()) {
        let taskName = 'basketInfo';
        this.triggerService.registerTimeHandler(taskName, this.basketInfo, this);
        this.triggerService.addTaskByTime({
          triggerTime: timeCurrent() + 1000,
          name: taskName,
          comment: this.symbol,
          interval: 5 * 1000,
        });

        await this.basketInfo();
      }

      this.buyPosition = this.posSlot['long'];
    }
  }

  async createLimitByStep() {
    trace('stdGridBasket::createLimitByStep', this.symbol, await this.marketInfoShort());

    let triggerPrice = this.price() * (1 - this.gridStepPercent / 100);

    if (triggerPrice <= 0) {
      error('stdGridBasket::createLimitByStep ' + this.symbol, 'Trigger price is zero or negative', {
        triggerPrice,
        mInfo: await this.marketInfoShort(),
      });
      return;
    }

    this.bInfo.nextOrderPrice = triggerPrice;

    //!important: you should force update position because websocket updates are not always fast enough
    let position = await this.getPositionBySide('long', true);

    // sizeFactor 1, positions size 1 ->2 -> 4 -> 8
    // sizeFactor 0.5  positions size 2 -> 3 -> 4.5 -> 6.75
    let amount = position.contracts * this.sizeFactor || this.getContractsAmount(this.sizeUsd);

    if (amount <= 0) {
      error(
        'stdGridBasket::createLimitByStep ' + this.symbol,
        'Amount is zero or negative, cannot create limit order',
        {
          amount,
          position,
          sizeUsd: this.sizeUsd,
          amountByUsd: this.getContractsAmount(this.sizeUsd),
          gridStepPercent: this.gridStepPercent,
          tpPercent: this.tpPercent,
          sizeFactor: this.sizeFactor,
        },
      );
      return;
    }
    let order = await this.buyLimit(amount, triggerPrice);
  }

  buyPosition: Position;
  async onTick() {
    await this.checkRoundToClose();
  }

  async setLeverage(leverage: number) {
    if (leverage < this.MIN_LEVERAGE) {
      throw new BaseError(`Leverage ${leverage} is too low, minimum is ${this.MIN_LEVERAGE}`, {
        leverage,
        ...this.orderBasketInfo(),
      });
    }

    if (leverage > this.maxLeverage) {
      warning('stdGridBasket::setLeverage', `Leverage ${leverage} is too high, max is ${this.maxLeverage}`);
      leverage = this.maxLeverage;
    }

    await super.setLeverage(leverage);
  }

  async checkRoundToClose() {
    //this.buyPosition = await this.getPositionBySide('long');

    if (this.isStopped) return;

    const drawdown = longProfit(
      this.buyPosition.entryPrice,
      this.close(),
      this.buyPosition.contracts,
      this.contractSize,
    );

    if (this.sizeUsd * this.maxDrawdownPercent < -drawdown) {
      //
      await this.stopBasket();
    }
    try {
      if (this.buyPosition.entryPrice && percentDifference(this.buyPosition.entryPrice, this.bid()) > this.tpPercent) {
        await this.closeRound();
      }
    } catch (e) {
      error(e, { buyPosition: this.buyPosition, mi: await this.marketInfoShort() });
    }
  }

  profit = 0;

  public bInfo = {
    symbol: this.symbol,
    status: '🟢 OK', // or '🔴 Error'
    posSizeUsd: 0,
    toReBalance: '',
    toProfit: '',
    nextOrderPrice: 0,
    entryPrice: 0,
    price: 0,
    drawdown: 0,
    errors: [],
  };

  async basketInfo(args = {}) {
    try {
      if (args) {
        this.bInfo = { ...this.bInfo, ...args };
      }
      this.bInfo.symbol = this.symbol;

      if (this.initErrors.length > 0) {
        this.bInfo.status = '🔴 Error';
        this.bInfo['errors'] = this.initErrors;
      }

      let position = await this.getPositionBySide('long');
      if (position.contracts === 0) {
        this.bInfo.posSizeUsd = 0;
        this.bInfo.toReBalance = '';
        this.bInfo.toProfit = '';
        this.bInfo.nextOrderPrice = 0;

        globals.report.tableUpdate('Baskets Info', this.bInfo, 'symbol');
        return this.bInfo;
      } else {
        //let position = this.buyPosition;
        if (this.bInfo.nextOrderPrice === 0) {
          const orders = await this.getOpenOrders();

          logOnce('orders ' + this.symbol, 'Open orders for symbol:', orders);

          if (orders.length > 0) {
            this.bInfo.nextOrderPrice = orders[0].price;
          } else {
            // if no orders, then we need to create limit order by step
          }
        }

        //TODO investigate why nextOrderPrice is null sometimes
        if (!this.bInfo.nextOrderPrice) this.bInfo.nextOrderPrice = 0;

        const toProfit =
          round(percentDifference(this.price(), position.entryPrice * (1 + this.tpPercent / 100))) + ' %';
        const toReBalance = round(percentDifference(this.price(), this.bInfo.nextOrderPrice)) + ' %';

        logOnce('stdGridBasket::basketInfo' + this.symbol, 'Basket info for symbol:', {
          priceToProfit: this.price() * (1 + this.tpPercent / 100),
          diffToProfit: (this.price() * (1 + this.tpPercent / 100)) / position.entryPrice,
          price: this.price(),
          limitOrderPrice: this.bInfo.nextOrderPrice,
          entryPrice: position.entryPrice,
          diffToReBalance: this.price() / this.bInfo.nextOrderPrice,
        });

        this.bInfo.posSizeUsd = round(this.getUsdAmount(position.contracts));
        this.bInfo.toReBalance = toReBalance;
        this.bInfo.toProfit = toProfit;
        this.bInfo.drawdown = round(percentDifference(position.entryPrice, this.close(), true), 2);
        this.bInfo.entryPrice = position.entryPrice;
      }
      this.bInfo.price = this.price();
    } catch (e) {
      errorOnce('baseGridBasket::basketInfo ' + this.symbol, e.message, { basketInfo: this.bInfo, args });
    }
    globals.report.tableUpdate('Baskets Info', this.bInfo, 'symbol');

    return this.bInfo;
  }

  async stopBasket() {
    this.isStopped = true;
    await this.cancelAllOrders();
    let position = await this.getPositionBySide('long');

    if (position.contracts > 0) {
      await this.sellMarket(position.contracts);
    }
  }
  async newRound() {
    if (this.isStopped) return;
    this.basketId++;
    this._prevOrderPrice = 0;

    trace('stdGridBasket::newRound', this.symbol, await this.marketInfoShort());
    await this.buyMarket(this.getContractsAmount(this.sizeUsd));
    await this.createLimitByStep();
  }

  async closeRound() {
    trace('stdGridBasket::closeRound', this.symbol, await this.marketInfoShort());
    await this.closePosition('long');
    //clear all limits orders
    await this.cancelAllOrders();

    // start new round
    await this.newRound();

    if (globals.isDebug) {
      globals.report.tableUpdate('Grid Size Info', Object.values(this.gridSizeInfo), '_id');
      if (this.gridMaxSizeInfo > 5555) {
        //trace('stdGridBasket::closeRound', 'Grid max size info', this.gridSizeInfo);
        let prevPrice = undefined;
        for (const id in this.gridSizeInfo) {
          let info = this.gridSizeInfo[id];
          let currentPrice = info.price;
          let diff = prevPrice ? percentDifference(currentPrice, prevPrice) : 0;
          let dist = prevPrice ? currentPrice - prevPrice : 0;

          prevPrice = currentPrice;
          info['diff'] = diff;
          info['dist'] = dist;
        }
        globals.report.tableUpdate('gridSizeInfo', Object.values(this.gridSizeInfo), '_id');
        //  globals.strategy.forceStop('debug Grid max size info');
      }

      this.gridSizeInfo = {};
      this.gridMaxSizeInfo = 0;
    }
  }
  gridSizeInfo = {};
  gridMaxSizeInfo = 0;

  async onOrderChange(order: Order) {
    if (order.status === 'closed' && order.reduceOnly === false && order.type === 'limit') {
      //warning('createLimitByStep', '', { order });
      await this.createLimitByStep();

      if (globals.isDebug) {
        let amount = (await this.getPositionBySide('long')).contracts ?? 0;
        let posUsdSize = this.getUsdAmount(amount);

        this.gridSizeInfo[order.id] = {
          time: timeToString(),
          price: this.price(),
          sizeUsd: posUsdSize,
          amount,
          basketId: this.basketId,
        };
        this.gridMaxSizeInfo = max(this.gridMaxSizeInfo, posUsdSize);
      }
    }
  }

  lastOrder: Order | null = null;
  private _prevOrderPrice = 0;
}
