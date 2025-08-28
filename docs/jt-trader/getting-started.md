---
id: jt-trader-getting-started
title: Getting Started with JT-Trader
sidebar_label: Getting Started
---

# Getting Started with JT-Trader

JT-Trader is a high-level trading framework built on top of JT-Lib that simplifies strategy development and portfolio management.

## Installation

```bash
npm install jt-trader
# or
yarn add jt-trader
```

## Basic Usage

```typescript
import { Trader, Strategy } from 'jt-trader';

// Initialize trader
const trader = new Trader({
  apiKey: 'your-api-key',
  secret: 'your-secret',
  exchange: 'binance'
});

// Create a simple strategy
class SimpleStrategy extends Strategy {
  async onTick(data) {
    const { symbol, price } = data;
    
    // Simple moving average strategy
    if (this.shouldBuy(price)) {
      await this.buy(symbol, 0.01);
    } else if (this.shouldSell(price)) {
      await this.sell(symbol, 0.01);
    }
  }
  
  shouldBuy(price) {
    // Your buy logic here
    return price < this.averagePrice * 0.95;
  }
  
  shouldSell(price) {
    // Your sell logic here
    return price > this.averagePrice * 1.05;
  }
}

// Start trading
const strategy = new SimpleStrategy();
trader.addStrategy(strategy);
trader.start();
```

## Key Features

### Strategy Framework
Easy-to-use base classes for building custom trading strategies with built-in lifecycle management.

### Portfolio Management
Automatic tracking of positions, P&L, and portfolio performance across multiple assets.

### Risk Controls
Built-in risk management features including position sizing, stop-loss, and drawdown protection.

### Performance Analytics
Comprehensive performance metrics and reporting for strategy evaluation.

## Next Steps

- **[Installation](installation)** - Detailed installation instructions
- **[Configuration](configuration)** - Learn about configuration options
- **[Usage](usage)** - Advanced usage patterns and best practices

## Examples

Visit our [examples repository](https://github.com/mikolyk/jt-trader/examples) for complete strategy examples and use cases.
