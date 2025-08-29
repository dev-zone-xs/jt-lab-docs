---
id: api-specification
title: API Specification
sidebar_label: API Specification
---

# API Specification

This document provides a comprehensive specification of the JT-Lib API for developing trading robots and strategies.

## Overview

Here is the categorized list of functions, divided into Trading API and Environment API, with brief descriptions for each:

## Trading API

The Trading API provides functions for market data access, order management, and trading operations.

### Market Data Functions

* **`symbolInfo(symbol: string)`**: Returns information about a specific symbol, including trading conditions and limits.
* **`tms(symbol? = undefined)`**: Returns the timestamp of the current candle for the given symbol.
* **`open(symbol?: string)`**: Returns the open price of the current candle for the given symbol.
* **`high(symbol?: string)`**: Returns the high price of the current candle for the given symbol.
* **`low(symbol?: string)`**: Returns the low price of the current candle for the given symbol.
* **`close(symbol?: string)`**: Returns the closing price of the current candle for the given symbol.
* **`volume(symbol?: string)`**: Returns the trading volume of the current candle for the given symbol.
* **`ask(symbol?: string, index: number = 0)`**: Returns the ask price (lowest sell order) for the given symbol.
* **`bid(symbol?: string, index: number = 0)`**: Returns the bid price (highest buy order) for the given symbol.

### Orders and Trades

* **`createOrder(symbol, type, side, amount, price, params)`**: Creates an order with the specified parameters.
* **`cancelOrder(id, symbol)`**: Cancels an order by its ID.
* **`modifyOrder(id, symbol, type, side, amount, price, params)`**: Modifies an existing order with new parameters.
* **`getOrders(symbol, since, limit, params)`**: Retrieves a list of orders based on the provided criteria.
* **`getOpenOrders(symbol, since, limit, params)`**: Retrieves a list of open orders for a symbol.
* **`getClosedOrders(symbol, since, limit, params)`**: Retrieves a list of closed orders for a symbol.
* **`getOrder(id, symbol)`**: Retrieves details of a specific order by ID.
* **`getPositions(symbols, options)`**: Retrieves all open positions for the specified symbols.
* **`getBalance()`**: Provides the balance details of the current account.
* **`getFee()`**: Retrieves the total trading fees incurred by the script.
* **`getProfit()`**: Retrieves the total profit from closed positions by the script.
* **`getHistory(symbol, timeframe, startTime, limit)`**: Retrieves historical candle data for a symbol.

## Environment API

The Environment API provides functions for script execution environment, caching, and reporting.

### Script and Execution Environment

* **`getArtifactsKey()`**: Retrieves a unique key for storing script artifacts.
* **`registerCallback(funcName, callback)`**: Registers a callback for specific trading functions.
* **`isTester()`**: Checks if the script is running in a testing environment.
* **`getErrorTrace(stack)`**: Provides a detailed error traceback.
* **`updateReport(data)`**: Updates the report data for the script.
* **`setCache(key, value)`**: Stores a value in the script's cache.
* **`getCache(key)`**: Retrieves a value from the script's cache.
* **`getPrefix()`**: Returns a prefix used in order identifiers.
* **`setLeverage(leverage, symbol)`**: Sets the leverage for futures trading on a specific symbol.

## Usage Examples

### Basic Market Data Access

```typescript
// Get current price data
const currentPrice = close('BTC/USDT');
const highPrice = high('BTC/USDT');
const lowPrice = low('BTC/USDT');

// Get order book data
const askPrice = ask('BTC/USDT');
const bidPrice = bid('BTC/USDT');
```

### Order Management

```typescript
// Create a market buy order
const order = createOrder('BTC/USDT', 'market', 'buy', 0.001);

// Cancel an order
cancelOrder(orderId, 'BTC/USDT');

// Get open orders
const openOrders = getOpenOrders('BTC/USDT');
```

### Environment Functions

```typescript
// Check if running in tester
if (isTester()) {
  console.log('Running in test mode');
}

// Cache data
setCache('lastPrice', 50000);
const cachedPrice = getCache('lastPrice');
```

## Next Steps

- **[Getting Started](/docs/jt-lib/getting-started)** - Learn the basics of using JT-Lib
- **[Interfaces](/docs/jt-lib/interfaces)** - Detailed API documentation
- **[Overview](/docs/jt-lib/overview)** - General overview of JT-Lib components
