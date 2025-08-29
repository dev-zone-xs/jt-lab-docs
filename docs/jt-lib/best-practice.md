---
id: best-practice
title: Best Practices
sidebar_label: Best Practices
---

# Best Practice

![Best Practice Screenshot](/images/image_best_practice1.png)

Our vision is that the **`Strategy`** class acts as the origin for all global variables, including **Event Emitters**, **Trigger Services**, **Storage**, **Orders Baskets**, and **Reports**.

* The **OrdersBasket** class encapsulates all the trading strategy logic.
* Each instance of **OrdersBasket** operates independently and is not influenced by other instances.
* The **`Strategy`** class serves as a starting point for all associated classes and objects. It can monitor the state of **OrdersBasket** instances and interact with them as needed.

## Example: GridBot

### Description

GridBot - crypto robot with grid strategy that could be running for multiple symbols.

* **In the tester:**
  * 10 scenarios will be created for each symbol in the `symbols` list.
  * A full report will aggregate statistics across all scenarios, simulating the conditions as if they were running all together at runtime.
* **At runtime:**
  * A single scenario will be created, and within the script, ten **Orders Baskets** will be instantiated for each symbol in the `symbols` list.

### OrdersBasket Logic

The logic of the strategy is defined within the **OrdersBasket** class:

* **Start (`onInit`):**
  * Opens a long position upon the first launch.
  * Creates a limit buy order at a price offset from the current price by a percentage specified by the parameter `gridStepPercent`.
* **Order Grid Creation:**
  * The grid of orders is created sequentially.
  * Each new order is only placed after the previous order is closed (`onOrderChange`).
  * Orders are placed at a percentage offset from the current price.
* **Profit-Taking (`onTick`):**
  * Profit is secured when the price reaches a specific percentage above the entry price.

This structure ensures modularity and efficient management of trading logic, making it scalable for both testing and live execution environments.

## Strategy Implementation

```typescript
class Strategy extends Script {
  static definedArgs = [
    {
      key: 'symbols',
      defaultValue: 'BCH/USDT,BTC/USDT,ADA/USDT,ETH/USDT,XRP/USDT,TRX/USDT,SOL/USDT,LTC/USDT,BNB/USDT,DOGE/USDT',
    },
    {
      key: 'gridStepPercent',
      defaultValue: 5,
    },
  ];
  baskets: Record<string, GribBasket> = {};
  private reportLayout: StandardReportLayout;

  async onInit() {
    this.reportLayout = new StandardReportLayout();

    globals.triggers.addTaskByTime({
      callback: this.createBaskets,
      triggerTime: currentTime() + 60 * 1000,
      name: 'createBaskets',
    });
  }

  // Create a basket for each symbol
  createBaskets = async () => {
    for (const symbol of this.symbols) {
      this.baskets[symbol] = new GribBasket({
        symbol,
        connectionName: this.connectionName,
      });

      await this.baskets[symbol].init();
    }
  };
}
```

## GribBasket Implementation

```typescript
export class GribBasket extends OrdersBasket {
  usdSize: number = getArgNumber('usdSize', 100); //$
  gridStepPercent = getArgNumber('gridStepPercent', 5); //% 
  basketProfit = getArgNumber('basketProfit', 5); //%

  async init() {
    await super.init();

    if (this.isInit) {
      let orders = await this.getOpenOrders();

      if ((await this.getPositionBySide('long')).contracts === 0) {
        await this.buyMarket(this.getContractsAmount(this.usdSize));
      }

      if (orders.length === 0) {
        await this.createLimitByStep();
      }
    }
  }

  async onTick() {
    let position = await this.getPositionBySide('long');

    if (position.entryPrice && percentDifference(this.close(), position.entryPrice) > this.basketProfit) {
      await this.closePosition('long');
      await this.cancelAllOrders();
      await this.buyMarket(this.getContractsAmount(this.usdSize));
      await this.createLimitByStep();
    }
  }

  async onOrderChange(order: Order) {
    if (order.status === 'closed' && order.reduceOnly === false) {
      await this.createLimitByStep();
    }
  }

  async createLimitByStep() {
    let triggerPrice = this.close() * (1 - this.gridStepPercent / 100);
    let amount = this.getContractsAmount(this.usdSize);
    let order = await this.buyLimit(amount, triggerPrice);
    warning('createLimitByStep', '', { order });
  }
}
```

## Key Concepts

### Modular Design

The Strategy class acts as a coordinator, while OrdersBasket handles the actual trading logic for each symbol.

### Independent Execution

Each OrdersBasket instance operates independently, allowing for better scalability and error isolation.

### Event-Driven Architecture

The system uses events and callbacks to handle market data and order changes efficiently.

## Next Steps

- **[Getting Started](/docs/jt-lib/getting-started)** - Learn the basics of using JT-Lib
- **[API Specification](/docs/jt-lib/api-specification)** - Complete API reference
- **[Overview](/docs/jt-lib/overview)** - General overview of JT-Lib components



