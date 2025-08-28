---
id: base-script
title: BaseScript
sidebar_label: BaseScript
---

# BaseScript

BaseScript is the foundation class for all trading scripts in JT-Lib. It extends BaseObject and provides essential functionality for script lifecycle management, event handling, and trading operations.

## Overview

BaseScript serves as the base class that all custom trading scripts should extend. It handles initialization, cleanup, and provides access to core trading services through global objects.

## Installation

```typescript
import { BaseScript } from 'jt-lib';
```

## Basic Usage

```typescript
import { BaseScript } from 'jt-lib';

class MyTradingScript extends BaseScript {
  async onInit() {
    // Initialize your script
    console.log('Script initialized');
  }

  async onTick(data) {
    // Handle market data updates
    console.log('Tick received:', data.symbol, data.close);
  }

  async onStop() {
    // Cleanup when stopping
    console.log('Trading stopped');
  }
}

// Create script with arguments
const script = new MyTradingScript({
  connectionName: 'binance',
  symbols: 'BTC/USDT,ETH/USDT'
});
```

## Constructor Parameters

BaseScript requires specific arguments in the constructor:

```typescript
interface GlobalARGS {
  connectionName: string;  // Required: Exchange connection name
  symbols: string;         // Required: Comma-separated trading symbols
  hedgeMode?: boolean;     // Optional: Enable hedge mode
  interval?: number;       // Optional: Timer interval in milliseconds
}
```

## Class Properties

### Required Properties
- `connectionName: string` - Exchange connection name
- `symbols: string[]` - Array of trading symbols

### Optional Properties
- `hedgeMode: boolean` - Enable hedge mode (default: false)
- `interval: number` - Timer interval for onTimer calls
- `timeframe: number` - Trading timeframe
- `version: number` - Script version (default: 3)

### Internal Properties
- `isInitialized: boolean` - Initialization status
- `balanceTotal: number` - Total account balance
- `balanceFree: number` - Free account balance
- `iterator: number` - Tick counter
- `isStop: boolean` - Stop flag

## Lifecycle Methods

### onInit()
Called once when the script is initialized. Use this method to:
- Set up configuration
- Initialize variables
- Prepare trading parameters
- Validate settings

```typescript
async onInit() {
  // Initialize strategy parameters
  this.stopLoss = 0.05;
  this.takeProfit = 0.10;
  
  // Validate configuration
  if (!this.stopLoss || !this.takeProfit) {
    throw new Error('Missing required parameters');
  }
}
```

### onTick(data: Tick)
Called on every market data update. This is the main method for implementing trading logic.

```typescript
async onTick(data) {
  const { symbol, close, volume } = data;
  
  // Implement your trading strategy here
  if (this.shouldBuy(close)) {
    await this.placeBuyOrder(symbol, 0.01);
  }
}
```

### onStop()
Called when the script is stopped. Use this method to:
- Close open positions
- Cancel pending orders
- Clean up resources
- Save final state

```typescript
async onStop() {
  // Close all open positions
  await this.closeAllPositions();
  
  // Save final state
  await this.saveState();
}
```

### onTimer()
Called at regular intervals if `interval` is set. Useful for periodic tasks.

```typescript
async onTimer() {
  // Update strategy every minute
  await this.updateStrategy();
  
  // Log performance metrics
  this.logPerformance();
}
```

### onOrderChange(order: Order)
Called when order status changes. Handle order updates here.

```typescript
async onOrderChange(order) {
  if (order.status === 'closed') {
    this.log(`Order ${order.id} closed at ${order.price}`);
    
    // Update position tracking
    await this.updatePosition(order);
  }
}
```

### onArgsUpdate(args: GlobalARGS)
Called when script arguments are updated during runtime.

```typescript
async onArgsUpdate(args) {
  // Handle dynamic parameter updates
  if (args.stopLoss !== undefined) {
    this.stopLoss = args.stopLoss;
    this.log(`Stop loss updated to ${this.stopLoss}`);
  }
}
```

### onEvent(event: string, data: any)
Called for custom events. Handle custom event logic here.

```typescript
async onEvent(event, data) {
  switch (event) {
    case 'marketAlert':
      await this.handleMarketAlert(data);
      break;
    case 'riskWarning':
      await this.handleRiskWarning(data);
      break;
  }
}
```

### onReportAction(action: string, payload: any)
Called for report-related actions. Handle reporting logic here.

```typescript
async onReportAction(action, payload) {
  if (action === 'generateReport') {
    await this.generateTradingReport(payload);
  }
}
```

## Global Services

BaseScript provides access to global services through the `globals` object:

### globals.events
Event emitter for custom events and lifecycle hooks.

```typescript
// Emit custom events
await globals.events.emit('strategyUpdate', { action: 'buy', price: 50000 });

// Listen to events
globals.events.on('orderFilled', this.handleOrderFilled.bind(this));
```

### globals.triggers
Trigger service for conditional trading actions.

```typescript
// Add price trigger
await globals.triggers.addPriceTrigger('BTC/USDT', 'above', 50000, () => {
  this.placeBuyOrder('BTC/USDT', 0.01);
});
```

### globals.report
Report generation service.

```typescript
// Generate trading report
await globals.report.generateReport({
  title: 'Trading Summary',
  period: 'daily'
});
```

### globals.storage
Persistent storage service.

```typescript
// Save data
await globals.storage.set('lastTrade', { price: 50000, amount: 0.01 });

// Load data
const data = await globals.storage.get('lastTrade');
```

### globals.candlesBufferService
Candlestick data buffer service.

```typescript
// Get historical candles
const candles = await globals.candlesBufferService.getCandles('BTC/USDT', '1h', 100);
```

### globals.indicators
Technical indicators service.

```typescript
// Calculate moving average
const sma = await globals.indicators.sma('BTC/USDT', 20, 'close');
```

## Error Handling

BaseScript provides built-in error handling:

```typescript
class SafeTradingScript extends BaseScript {
  async onTick(data) {
    try {
      await this.executeStrategy(data);
    } catch (error) {
      // Log error
      console.error('Strategy error:', error);
      
      // Stop script on critical errors
      if (error.critical) {
        this.forceStop('Critical error occurred');
      }
    }
  }
}
```

### forceStop(reason: string)
Forcefully stop the script execution.

```typescript
// Stop script immediately
this.forceStop('Maximum loss reached');
```

## Configuration Example

```typescript
// Script configuration
const config = {
  connectionName: 'binance',
  symbols: 'BTC/USDT,ETH/USDT',
  hedgeMode: false,
  interval: 60000, // 1 minute timer
  stopLoss: 0.05,
  takeProfit: 0.10,
  maxPosition: 0.1
};

// Create script instance
const script = new MyTradingScript(config);
```

## Best Practices

1. **Always implement required methods** - onInit, onTick, onStop
2. **Use proper error handling** - Wrap critical operations in try-catch
3. **Validate constructor parameters** - Check required fields in constructor
4. **Clean up resources** - Implement proper cleanup in onStop()
5. **Use global services** - Leverage built-in services for common tasks
6. **Handle order changes** - Implement onOrderChange for order tracking
7. **Use timer for periodic tasks** - Set interval for non-tick operations

## Example: Complete Trading Script

```typescript
import { BaseScript } from 'jt-lib';

class SimpleMovingAverageScript extends BaseScript {
  private stopLoss: number;
  private takeProfit: number;
  private position: any;

  constructor(args) {
    super(args);
    this.stopLoss = 0.05;
    this.takeProfit = 0.10;
  }

  async onInit() {
    this.log('Initializing moving average strategy');
    this.log(`Symbols: ${this.symbols.join(', ')}`);
    this.log(`Stop Loss: ${this.stopLoss}, Take Profit: ${this.takeProfit}`);
  }

  async onTick(data) {
    const { symbol, close } = data;
    
    // Simple moving average strategy
    if (this.shouldBuy(close)) {
      await this.placeBuyOrder(symbol, 0.01);
    } else if (this.shouldSell(close)) {
      await this.placeSellOrder(symbol, 0.01);
    }
  }

  async onStop() {
    this.log('Stopping strategy');
    if (this.position) {
      await this.closePosition(this.position.id);
    }
  }

  private shouldBuy(price: number): boolean {
    // Implement your buy logic here
    return price < this.averagePrice * (1 - this.stopLoss);
  }

  private shouldSell(price: number): boolean {
    // Implement your sell logic here
    return price > this.averagePrice * (1 + this.takeProfit);
  }

  private async placeBuyOrder(symbol: string, amount: number) {
    // Place buy order logic
    this.log(`Placing buy order for ${amount} ${symbol}`);
  }

  private async placeSellOrder(symbol: string, amount: number) {
    // Place sell order logic
    this.log(`Placing sell order for ${amount} ${symbol}`);
  }

  private async closePosition(positionId: string) {
    // Close position logic
    this.log(`Closing position ${positionId}`);
  }
}

export default SimpleMovingAverageScript;
```

## Next Steps

- **[Trading API](trading-api)** - Learn about order management
- **[Market API](market-api)** - Access market data
- **[Event Emitter](event-emitter)** - Build reactive strategies
- **[Storage](storage)** - Persist script data
