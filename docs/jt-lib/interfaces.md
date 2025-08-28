---
id: interfaces
title: Types & Interfaces
sidebar_label: Types & Interfaces
---

# Types & Interfaces

This document contains all the TypeScript types and interfaces used throughout JT-Lib. These definitions provide the foundation for type safety and API documentation.

## Overview

JT-Lib uses TypeScript interfaces to define the structure of data objects, API responses, and configuration parameters. All interfaces are organized by category for easy reference.

## Global Arguments

### GlobalARGS
Configuration and runtime parameters for scripts.

```typescript
type GlobalARGS = {
  exchange: string;
  start: string; //"2021-01"
  end: string; //"2021-12"
  startDate: Date; //"2021-01-01T00:00:00.000Z"
  endDate: Date; // "2021-12-31T23:59:59.000Z"
  symbol: string;
  timeframe: string;
  optimizerIteration: number;
  makerFee: number;
  takerFee: number;
  marketOrderSpread: number;
  balance: number;
  leverage: number;
} & Record<string, string | number | boolean>;
```

**Required Fields:**
- `exchange` - Exchange name (e.g., "binance", "bybit")
- `symbol` - Trading symbol (e.g., "BTC/USDT")
- `timeframe` - Candlestick timeframe ("1m", "5m", "15m", "1h", "1d")

**Optional Fields:**
- `start/end` - Date range in "YYYY-MM" format
- `startDate/endDate` - Date objects for precise timing
- `makerFee/takerFee` - Fee rates as percentages
- `balance` - Initial account balance
- `leverage` - Trading leverage

## Trading Types

### Order Types

#### Order
Complete order information structure.

```typescript
interface Order {
  id?: string;
  error?: string;
  clientOrderId?: string;
  datetime?: string;
  timestamp?: number;
  lastTradeTimestamp?: number;
  status?: 'open' | 'closed' | 'canceled' | string;
  symbol?: string;
  type?: string;
  timeInForce?: string;
  side?: 'buy' | 'sell' | string;
  positionSide?: PositionSideType;
  price?: number;
  average?: number;
  amount?: number;
  filled?: number;
  remaining?: number;
  cost?: number;
  trades?: Trade[];
  fee?: Fee;
  info?: any;
  reduceOnly?: boolean;
  stopType?: string;
  realId?: string;
  emulated?: boolean;
}
```

**Key Fields:**
- `id` - Unique order identifier
- `status` - Order status (open, closed, canceled)
- `side` - Order side (buy, sell)
- `type` - Order type (market, limit)
- `amount` - Total order amount
- `filled` - Amount already filled
- `remaining` - Amount still pending

#### OrderType
Supported order types.

```typescript
type OrderType = 'market' | 'limit';
```

#### OrderSide
Order direction.

```typescript
type OrderSide = 'buy' | 'sell';
```

#### PositionSideType
Position side for futures trading.

```typescript
type PositionSideType = 'long' | 'short' | 'both';
```

#### Fee
Order fee information.

```typescript
interface Fee {
  type?: 'taker' | 'maker' | string;
  currency: string;
  rate?: number;
  cost: number;
}
```

#### Trade
Individual trade execution details.

```typescript
interface Trade {
  amount: number;
  datetime: string;
  id: string;
  info: any;
  order?: string;
  price: number;
  timestamp: number;
  type?: string;
  side: 'buy' | 'sell' | string;
  symbol: string;
  takerOrMaker: 'taker' | 'maker' | string;
  cost: number;
  fee: Fee;
}
```

### Position Types

#### Position
Position information for futures trading.

```typescript
interface Position {
  emulated?: boolean;
  id?: string;
  symbol?: string;
  contracts?: number; // amount base currency (contracts)
  contractSize?: number;
  unrealizedPnl?: number;
  leverage?: number;
  liquidationPrice?: number;
  collateral?: number; // amount quote currency (collateral)
  notional?: number;
  markPrice?: number;
  entryPrice?: number;
  timestamp?: number; // unix timestamp milliseconds
  initialMargin?: number;
  initialMarginPercentage?: number;
  maintenanceMargin?: number;
  maintenanceMarginPercentage?: number;
  marginRatio?: number;
  datetime?: string;
  marginMode?: 'cross' | 'isolated';
  marginType?: 'cross';
  side?: 'short' | 'long' | string;
  hedged?: boolean;
  percentage?: number;
}
```

**Key Fields:**
- `symbol` - Trading symbol
- `contracts` - Position size in base currency
- `unrealizedPnl` - Unrealized profit/loss
- `leverage` - Position leverage
- `entryPrice` - Average entry price
- `markPrice` - Current mark price
- `side` - Position side (long, short)

#### PositionSide
Position direction.

```typescript
type PositionSide = 'long' | 'short';
```

## Market Data Types

### Tick Types

#### Tick
Real-time market data structure.

```typescript
interface Tick {
  symbol: string;
  info: any;
  timestamp: number;
  datetime: string;
  high: number;
  low: number;
  bid: number;
  bidVolume?: number;
  ask: number;
  askVolume?: number;
  vwap?: number;
  open: number;
  close: number;
  last?: number;
  previousClose?: number;
  change?: number;
  percentage?: number;
  average?: number;
  quoteVolume?: number;
  baseVolume?: number;
  volume: number;
}
```

**Key Fields:**
- `symbol` - Trading symbol
- `timestamp` - Unix timestamp
- `bid/ask` - Best bid and ask prices
- `high/low` - High and low prices
- `open/close` - Opening and closing prices
- `volume` - Trading volume

### Candle Types

#### Candle
OHLC candlestick data.

```typescript
interface Candle {
  timestamp: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
}
```

#### OHLC
Alternative candlestick format as array.

```typescript
type OHLC = [number, number, number, number, number, number];
// [timestamp, open, high, low, close, volume]
```

### Symbol Types

#### Symbol
Symbol information and metadata.

```typescript
interface Symbol {
  symbol: string;
  settleId: string;
  precision: { amount: number; quote: number; price: number; base: number };
  settle: string;
  baseId: string;
  type: string;
  lowercaseId: string;
  quote: string;
  percentage: boolean;
  contractSize: number;
  id: string;
  taker: number;
  limits: {
    market: { min: number; max: number };
    leverage: { min: number; max: number };
    amount: { min: number; max: number };
    cost: { min: number; max: number };
    price: { min: number; max: number };
  };
  inverse: boolean;
  margin: boolean;
  linear: boolean;
  swap: boolean;
  contract: boolean;
  active: boolean;
  maker: number;
  quoteId: string;
  future: boolean;
  feeSide: string;
  spot: boolean;
  tierBased: boolean;
  base: string;
  option: boolean;
}
```

**Key Fields:**
- `symbol` - Symbol name (e.g., "BTC/USDT")
- `precision` - Decimal precision for amounts, prices
- `limits` - Trading limits and constraints
- `contractSize` - Contract size for futures
- `maker/taker` - Fee rates
- `active` - Whether symbol is active for trading

## Reporting Types

### Report Block Types

#### ReportBlockType
Supported report block types.

```typescript
type ReportBlockType =
  | 'trading_view_chart'
  | 'table'
  | 'chart'
  | 'card'
  | 'optimizer_results'
  | 'action_button'
  | 'text';
```

#### ReportData
Complete report structure.

```typescript
interface ReportData {
  id: string;
  symbol: string;
  description?: string;
  blocks: ReportBlock[];
}
```

#### ReportBlock
Generic report block structure.

```typescript
interface ReportBlock {
  type: ReportBlockType;
  name?: string;
  data: ReportBlockData;
}
```

### Specific Report Blocks

#### TableDataReportBlock
Table data display.

```typescript
type TableDataReportBlock = GenericReportBlock<'table', TableRow[]>;
type TableRow = Record<string, any>;
```

#### CardDataReportBlock
Card display with title and value.

```typescript
type CardDataReportBlock = GenericReportBlock<'card', CardData>;

interface CardData {
  title: string;
  value: string | number;
  variant: CardVariant;
  options?: CardOptions;
}

type CardVariant = 'text' | 'number' | 'percent';
type CardNumberFormat = 'default' | 'currency' | 'date';
```

#### ChartDataReportBlock
Chart visualization.

```typescript
type ChartDataReportBlock = GenericReportBlock<'chart', ChartData>;

interface ChartData {
  series: Series[];
  time: string[];
}

interface Series {
  name: string;
  data: number[];
}
```

#### TextReportBlock
Text content display.

```typescript
type TextReportBlock = GenericReportBlock<'text', TextData>;

interface TextData {
  value: string;
  variant: string;
  align: string;
}
```

#### ActionButtonReportBlock
Interactive action buttons.

```typescript
type ActionButtonReportBlock = GenericReportBlock<'action_button', ActionButtonData>;

interface ActionButtonData {
  title: string;
  paramName: string;
  value: string | number;
}
```

## Time Frame Types

### TimeFrame
Supported candlestick timeframes.

```typescript
type TimeFrame = '1m' | '5m' | '15m' | '1h' | '1d';
```

## Event System Types

### EventListener
Event listener configuration.

```typescript
interface EventListener {
  id: string;
  event: string;
  handlerName: string;
  handler: (data?: any) => Promise<void>;
  owner: BaseObject;
  ownerName: string;
  ownerId: string;
  result?: any;
}
```

### TickExecutionData
Tick execution information.

```typescript
interface TickExecutionData {
  interval: number;
  symbol: string;
  nextTick: number;
}
```

## Trigger System Types

### TriggerTask
Base trigger task structure.

```typescript
interface TriggerTask {
  id: string;
  name: string;
  args?: any;
  callback?: (args?: any) => Promise<void>;
  type: TaskType;
  executedTimes: number;
  retry?: boolean | number;
  isTriggered: boolean;
  isActive: boolean;
  created: string;
  lastExecuted: string | null;
  createdTms: number;
  comment?: string;
  result?: any;
  error?: string;
}
```

### TaskType
Supported trigger task types.

```typescript
type TaskType = 'price' | 'time' | 'order';
```

### TriggerServiceInterface
Trigger service interface.

```typescript
interface TriggerServiceInterface {
  addTaskByOrder: (params: CreateOrderTaskParams) => string;
  addTaskByPrice: (params: CreatePriceTaskParams & { symbol: string }) => string;
  addTaskByTime: (params: CreateTimeTaskParams) => string;

  getActiveTasks(): TriggerTask[];
  getInactiveTasks(): TriggerTask[];
  getTasksByName(taskName: string, type: TaskType): TriggerTask[];

  cancelOrderTask(taskId: string): void;
  cancelPriceTask(taskId: string, symbol: string): void;
  cancelTimeTask(taskId: string): void;

  cancelAll(): void;
  cancelAllOrderTasks(): void;
  cancelAllPriceTasks(): void;
  cancelAllTimeTasks(): void;
}
```

### TriggerHandler
Trigger handler configuration.

```typescript
interface TriggerHandler {
  callback: (args?: any) => Promise<unknown>;
  funcName: string;
}
```

### Price Trigger Types

#### PriceTriggerInterface
Price trigger interface.

```typescript
interface PriceTriggerInterface {
  addTask: (params: CreatePriceTaskParams) => void;
}
```

#### CreatePriceTaskParams
Price trigger task parameters.

```typescript
interface CreatePriceTaskParams {
  name: string;
  triggerPrice: number;
  args?: any;
  callback?: (args?: any) => Promise<void>;
  retry?: boolean | number;
  comment?: string;
  group?: string;
  direction?: PriceTriggerDirection;
}
```

#### PriceTriggerTask
Price trigger task.

```typescript
interface PriceTriggerTask extends TriggerTask {
  symbol: string;
  triggerPrice: number;
  direction: PriceTriggerDirection;
  group?: string;
}
```

#### PriceTriggerDirection
Price trigger direction.

```typescript
enum PriceTriggerDirection {
  DownToUp = 'DownToUp',
  UpToDown = 'UpToDown',
}
```

### Time Trigger Types

#### TimeTrigger
Time trigger interface.

```typescript
interface TimeTrigger {
  addTask: (params: CreateTimeTaskParams) => void;
}
```

#### CreateTimeTaskParams
Time trigger task parameters.

```typescript
interface CreateTimeTaskParams {
  name: string;
  triggerTime: number;
  args?: any;
  callback?: (args?: any) => Promise<any>;
  retry?: boolean | number;
  interval?: number;
  comment?: string;
}
```

#### TimeTriggerTask
Time trigger task.

```typescript
interface TimeTriggerTask extends TriggerTask {
  triggerTime: number;
  interval?: number;
  comment?: string;
}
```

### Order Trigger Types

#### OrderTriggerInterface
Order trigger interface.

```typescript
interface OrderTriggerInterface {
  addTask(params: CreateOrderTaskParams): void;
}
```

#### CreateOrderTaskParams
Order trigger task parameters.

```typescript
type CreateOrderTaskParams = CreateTaskBaseParams & AtLeastOne<OrderIdFields, 'orderId' | 'clientOrderId'>;

interface CreateTaskBaseParams {
  name: string;
  args?: any;
  callback?: (args?: any) => Promise<any>;
  status: 'open' | 'closed' | 'canceled';
  retry?: boolean | number;
  comment?: string;
  group?: string;
}

interface OrderIdFields {
  orderId?: string;
  clientOrderId?: string;
}
```

#### OrderTriggerTask
Order trigger task.

```typescript
interface OrderTriggerTask extends TriggerTask {
  orderId?: string;
  clientOrderId?: string;
  status: 'open' | 'closed' | 'canceled';
  group?: string;
}
```

## Exchange Types

### ExchangeParams
Exchange connection parameters.

```typescript
interface ExchangeParams {
  symbol: string;
  connectionName?: string;
  hedgeMode?: boolean;
  prefix?: string;
  leverage?: number;
  triggerType?: TriggerType;
}
```

### TriggerType
Exchange trigger type.

```typescript
type TriggerType = 'exchange' | 'script';
```

### StopOrderData
Stop order data structure.

```typescript
interface StopOrderData {
  ownerOrderClientId: string;
  slClientOrderId?: string;
  slOrderId?: string;
  tpClientOrderId?: string;
  tpOrderId?: string;
}
```

### CreateTriggerOrderByTaskParams
Trigger order creation parameters.

```typescript
interface CreateTriggerOrderByTaskParams {
  type: OrderType;
  side: OrderSide;
  amount: number;
  price: number;
  params: Record<string, unknown>;
}
```

### StopOrderQueueItem
Stop order queue item.

```typescript
interface StopOrderQueueItem {
  ownerOrderId: string;
  sl?: number;
  tp?: number;
  prefix: string;
}
```

### ExchangeOrder
Exchange order information.

```typescript
interface ExchangeOrder {
  id: string;
  clientOrderId: string;
  side: 'buy' | 'sell';
  openPrice: number;
  closePrice: number;
  amount: number;
  status: string;
  profit: number;
  reduceOnly: boolean;
  dateOpen: string;
  dateClose: string;
  shortClientId: string;
}
```

### MarketInfoShort
Short market information.

```typescript
type MarketInfoShort = {
  symbol: string;
  close: number;
  buyContracts: number;
  buySizeUsd: number;
  BuyEntryPrice: number;
  sellContracts: number;
  sellSizeUsd: number;
  sellEntryPrice: number;
  leverage: number;
};
```

## Test Types

### RecordParams
Test recording parameters.

```typescript
interface RecordParams {
  symbol: string;
  timeframe: string;
  start: string;
  end: string;
}
```

### TestWatcherParams
Test watcher parameters.

```typescript
interface TestWatcherParams {
  symbol: string;
  timeframe: string;
}
```

### ObserverOrder
Observer order type.

```typescript
type ObserverOrder = Order & { uid: string };
```

### ObserverBalance
Observer balance information.

```typescript
interface ObserverBalance {
  // Implementation details
}
```

## Chart Types

### ReportChartOptions
Report chart options.

```typescript
interface ReportChartOptions {
  // Implementation details
}
```

### ReportCardParams
Report card parameters.

```typescript
interface ReportCardParams {
  // Implementation details
}
```

### ReportCardOptions
Report card options.

```typescript
interface ReportCardOptions {
  // Implementation details
}
```

### TextOptions
Text widget options.

```typescript
interface TextOptions {
  // Implementation details
}
```

### CandlesBufferOptions
Candles buffer options.

```typescript
interface CandlesBufferOptions {
  // Implementation details
}



## Примеры использования

### Пример с изображением

Вот пример того, как можно использовать типы для создания торгового графика:

![Пример торгового графика](./images/example-chart.svg)

**Примечание:** Нажмите на изображение выше, чтобы увеличить его. Docusaurus автоматически делает все изображения кликабельными для увеличения.

### Примеры кода

```typescript
// Создание заказа с использованием типов
const order: Partial<Order> = {
  symbol: 'BTC/USDT',
  type: 'limit',
  side: 'buy',
  amount: 0.01,
  price: 50000
};

// Обработка тика
function processTick(tick: Tick) {
  if (tick.close > tick.open) {
    console.log(`${tick.symbol} вырос на ${tick.close - tick.open}`);
  }
}
```

## Next Steps

- **[BaseScript](base-script)** - Learn about the base script class
- **[Trading API](trading-api)** - Understand trading operations
- **[Market API](market-api)** - Access market data
- **[Event System](event-emitter)** - Build reactive strategies
