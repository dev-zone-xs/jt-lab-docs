---
id: script-execution
title: Script Execution
sidebar_label: Script Execution
---

# Script Execution

To execute a script, you must define a `Strategy` class with the following structure.

## Base Script Interface

```typescript
abstract class BaseScriptInterface {
  protected constructor(args);

  connectionName: string;
  symbols: string[];
  interval: string;
 
  init: () => Promise<void>;
  stop: () => Promise<void> | void | never;
  
  runOnTick: (data: Tick) => Promise<void> | void;
  runTickEnded: (data: Tick) => Promise<void> | void;
  runOnTimer: () => Promise<void> | void;
  runOnOrderChange: (data: Order[]) => Promise<void> | void;
  runOnEvent: (data: any) => Promise<void> | void;
  runOnError: (e: any) => Promise<void | never> | never | void;
  runArgsUpdate: (args: GlobalARGS) => Promise<void> | void;
  runOnReportAction(action: string, payload: any) => Promise<void> | void;
}
```

## Variables List

* `connectionName` - Name of the connection to the exchange.
* `symbols` - List of symbols for which the strategy is running.
* `interval` - Interval of `runOnTimer` method in ms.

## Methods List

* `init` - In this method, initialization occurs before the main functionality of the script is launched.
* `stop` - Method for stopping the script.
* `runOnTimer` - Method that is called at a specified interval (ms).
* `runOnTick` - Method that is called on each new tick.
* `runTickEnded` - Method that is called after the end of the tick. (Tester only)
* `runOnOrderChange` - Method that is called when the order status changes.
* `runOnEvent` - Method that is called when websocket event occurs. (Runtime only)
* `runOnError` - Method that is called when an error occurs.
* `runArgsUpdate` - Method that is called when the script parameters are updated.
* `runOnReportAction` - Method that is called when an action is performed in the report.

## Script Execution Process

### 1. Environment Initialization

The environment creates an instance of the `Strategy` class and passes parameters to it through the `args` variable. Additionally, all parameters are accessible globally via the `ARGS` object.

After the class instance is created, the `connectionName` and `symbols` variables must be populated.

Using the `connectionName`, the environment subscribes to WebSocket events for all symbols specified in the `symbols` variable. These events include:

* **Ticks**: Arrival of a new tick
* **OrderBook**: Changes in the order book
* **Balance**: Updates to the account balance
* **Positions**: Modifications to open positions
* **Orders**: Updates to orders

:::info Timer vs Tick Mode
If the `interval` variable is set, the `runOnTimer` method will be triggered every `interval` milliseconds. In this case, the `runOnTick` method will not be called.
:::

### 2. Initialization (`init` Method)

After the class instance is created, the `init` method is called. This method is used to initialize the script.

### 3. Stopping the Script (`stop` Method)

The `stop` method is called when the script is stopped.

## Example Implementation

```typescript
class MyStrategy extends Script {
  async init() {
    // Initialize your strategy
    console.log('Strategy initialized');
  }

  async runOnTick(data: Tick) {
    // Handle new tick data
    const price = data.close;
    console.log('New tick:', price);
  }

  async runOnOrderChange(orders: Order[]) {
    // Handle order changes
    for (const order of orders) {
      console.log('Order changed:', order.id, order.status);
    }
  }

  async stop() {
    // Cleanup when stopping
    console.log('Strategy stopped');
  }
}
```

## Next Steps

- **[Getting Started](/docs/jt-lib/getting-started)** - Learn the basics of using JT-Lib
- **[Best Practices](/docs/jt-lib/best-practice)** - Best practices for script development
- **[API Specification](/docs/jt-lib/api-specification)** - Complete API reference
