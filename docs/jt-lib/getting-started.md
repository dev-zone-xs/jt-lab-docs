---
id: getting-started
title: Getting Started with JT-Lib
sidebar_label: Getting Started
---

# Getting Started with JT-Lib

JT-Lib is a powerful JavaScript library for algorithmic trading that provides direct access to exchange APIs, market data, and advanced trading functionality.

## Installation

```bash
npm install jt-lib
# or
yarn add jt-lib
```

## Basic Usage

```typescript
import { TradingAPI, Exchange } from 'jt-lib';

// Initialize trading API
const trading = new TradingAPI({
  apiKey: 'your-api-key',
  secret: 'your-secret',
  exchange: 'binance'
});

// Get account balance
const balance = await trading.getBalance();
console.log('Balance:', balance);

// Place an order
const order = await trading.createOrder(
  'BTC/USDT',
  'market',
  'buy',
  0.01
);
console.log('Order placed:', order);
```

## Key Concepts

### Trading API
The main interface for all trading operations including orders, positions, and account management.

### Exchange
Handles communication with different cryptocurrency exchanges with unified API.

### Market Data
Access to real-time and historical market information for analysis and decision making.

### Event System
Reactive programming model for building event-driven trading strategies.

## Next Steps

- **[BaseScript](base-script)** - Learn about the base class for trading scripts
- **[Trading API](trading-api)** - Learn about order management and trading operations
- **[Exchange API](exchange)** - Understand exchange integration and configuration
- **[Market API](market-api)** - Access market data and historical information
- **[Event Emitter](event-emitter)** - Build reactive trading strategies

## Examples

Check out our [examples repository](https://github.com/mikolyk/jt-lib/examples) for complete working examples of common trading strategies and use cases.
