import { globals } from './lib/core/globals';
import { currentTime } from './lib/utils/date-time';
import { log, warning } from './lib/core/log';
import { sleep } from './lib/utils/misc';
import { BaseScript } from './lib/script/base-script';
import { getArgString } from './lib/core/base';
import { DynamicGridBasket } from './jtGridSrc/DynamicGridBasket';
import { StandardReportLayout } from './lib/report/layouts';

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
