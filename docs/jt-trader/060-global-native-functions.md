---
id: 060-global-native-functions
title: Нативные функции системы JT-Trader
sidebar_label: Нативные функции
---

# Нативные функции системы JT-Trader

Данная документация описывает нативные функции, доступные в глобальной области видимости при разработке торговых стратегий в JT-Trader. Эти функции предоставляют прямой доступ к торговым операциям, рыночным данным и системным возможностям платформы.

## Архитектура функций

Нативные функции JT-Trader тесно связаны с библиотекой CCXT (CryptoCurrency eXchange Trading). Некоторые функции представляют собой прямые вызовы методов CCXT, в то время как другие были переписаны и адаптированы для обеспечения унификации интерфейса.

Такая архитектура была реализована для того, чтобы функционал работал одинаково как в тестере, так и в рантайме, обеспечивая единообразное поведение торговых операций независимо от режима выполнения.

## Функции среды выполнения

### getArtifactsKey()

Возвращает уникальный ключ артефакта для текущего скрипта, используемый для хранения данных отчетов.

```typescript
function getArtifactsKey(): string;
```

**Пример использования:**
```typescript
let artifactsKey = getArtifactsKey();
let reportUrl = "https://env1.jtnodes.one/report/" + artifactsKey;
```

### registerCallback()

Регистрирует callback-функцию для торговых операций (только в режиме разработки).

```typescript
function registerCallback(funcName: string, callback: (...args: any[]) => void): void;
```

**Параметры:**
- `funcName` - имя функции (createOrder, cancelOrder, modifyOrder, getOrders, getPositions, getBalance)
- `callback` - callback-функция (только асинхронная)

### isTester()

Определяет, выполняется ли скрипт в режиме тестирования.

```typescript
function isTester(): boolean;
```

**Пример использования:**
```typescript
if (isTester()) {
  // Логика только для тестера
  console.log("Выполняется в режиме тестирования");
}
```

### updateReport()

Обновляет отчет для текущего скрипта. Максимальная частота обновления - 1 раз в секунду. Максимальный размер отчета - 1MB.

```typescript
function updateReport(data: ReportData): Promise<void>;
```

**Важно:** Избегайте вызова в циклах без контроля интервала выполнения (особенно в onTick, onTimer).

### getCache() / setCache()

Функции для работы с кэшем данных.

```typescript
function setCache(key: string, value: any): Promise<void>;
function getCache<T>(key: string): Promise<T>;
```

### getPrefix()

Возвращает префикс текущего сценария скрипта. Используется для генерации clientOrderId.

```typescript
function getPrefix(): string;
```

**Логика генерации clientOrderId:**
- Если пользователь предоставил clientOrderId: `{prefix}.{userClientOrderId}`
- Если не предоставил: `{prefix}.{hashOfTimestamp}`

### setLeverage()

Устанавливает плечо для фьючерсной торговли.

```typescript
function setLeverage(leverage: number, symbol: string): Promise<any>;
```

**CCXT функция:** `setLeverage(leverage, symbol)`

**Параметры:**
- `leverage` - значение плеча (1-125)
- `symbol` - название символа (spot: BTC/USDT или futures: BTC/USDT:USDT)

## Функции рыночных данных

### symbolInfo()

Возвращает информацию о торговом символе.

```typescript
function symbolInfo(symbol: string): Promise<SymbolInfo>;
```

**CCXT источник:** `ccxt.markets[symbol]`

### Функции OHLC данных

```typescript
function tms(symbol?: string): number;    // Таймстамп текущей свечи
function open(symbol?: string): number;   // Цена открытия
function high(symbol?: string): number;   // Максимальная цена
function low(symbol?: string): number;    // Минимальная цена
function close(symbol?: string): number;  // Цена закрытия
function volume(symbol?: string): number; // Объем торгов
```

### ask() / bid()

Возвращают цены покупки и продажи из стакана заявок.

```typescript
function ask(symbol?: string, index: number = 0): [number, number];
function bid(symbol?: string, index: number = 0): [number, number];
```

**Возвращаемое значение:** `[цена, объем]`

### getHistory()

Получает исторические данные свечей.

```typescript
function getHistory(symbol: string, timeframe: TimeFrame, startTime: number, limit?: number): Promise<OHLC[]>;
```

**CCXT функция:** `fetchOHLCV(symbol, timeframe, since, limit)`

**Параметры:**
- `symbol` - название символа
- `timeframe` - таймфрейм свечей ('1m', '5m', '15m', '1h', '1d')
- `startTime` - время начала (timestamp)
- `limit` - количество свечей

**Пример использования:**
```typescript
let candles = await getHistory('BTC/USDT', '1h', 1614556800000, 10);
// Результат: [timestamp, open, high, low, close, volume]
```

## Торговые функции

### getPositions()

Возвращает массив открытых позиций.

```typescript
function getPositions(symbols?: string[], options = {}): Promise<Position[]>;
```

**CCXT функция:** 
- По умолчанию: система подписывается на события и позиции возвращаются из WebSocket соединений
- При `isForce = true`: `fetchPositions(symbols, params)`

**Пример использования:**
```typescript
let positions = await getPositions();
for (let position of positions) {
  console.log(`Symbol: ${position.symbol}, Size: ${position.contracts}, Entry: ${position.entryPrice}`);
}
```

### getBalance()

Возвращает информацию о балансе аккаунта.

```typescript
function getBalance(): Promise<{
  total: { USDT: number; [coin: string]: number };
  used: { USDT: number; [coin: string]: number };
  free: { USDT: number; [coin: string]: number };
}>;
```

**CCXT функция:** `fetchBalance()`

**Пример использования:**
```typescript
let balance = await getBalance();
console.log(`Free balance: ${balance.free.USDT}`);
```

### Функции работы с ордерами

#### getOrders() / getOpenOrders() / getClosedOrders()

```typescript
function getOrders(symbol: string, since = 0, limit = 500, params: any = undefined): Promise<Order[]>;
function getOpenOrders(symbol: string, since = 0, limit = 500, params: any = undefined): Promise<Order[]>;
function getClosedOrders(symbol: string, since = 0, limit = 500, params: any = undefined): Promise<Order[]>;
```

**CCXT функции:**
- `getOrders()` - может объединять несколько CCXT методов в зависимости от биржи (например, `fetchOrders()`, `fetchOpenOrders()`, `fetchClosedOrders()`)
- `getOpenOrders()` - может содержать несколько CCXT функций, так как у некоторых бирж разделены триггерные ордера и обычные открытые ордера
- `getClosedOrders()` - аналогично может объединять несколько CCXT методов для получения всех типов закрытых ордеров

#### getOrder()

Получает ордер по ID.

```typescript
function getOrder(id: string, symbol = ''): Promise<Order>;
```

**CCXT функция:** `fetchOrder(id, symbol)`

### createOrder()

Создает новый ордер.

```typescript
function createOrder(
  symbol: string,
  type: OrderType,
  side: OrderSide,
  amount: number,
  price: number,
  params: Record<string, unknown>
): Promise<Order>;
```

**CCXT функция:** `createOrder(symbol, type, side, amount, price, params)`

**Параметры:**
- `symbol` - торговый символ
- `type` - тип ордера ('limit', 'market')
- `side` - направление ('buy', 'sell')
- `amount` - количество в базовой валюте
- `price` - цена (для лимитных ордеров)
- `params` - дополнительные параметры

**Примеры использования:**

```typescript
// Рыночный ордер
let order = await createOrder('BTC/USDT', 'market', 'buy', 0.01, 10000, {});

// Стоп-лосс ордер
let sl = await createOrder('BTC/USDT', 'market', 'sell', 0.01, 9000, {
  stopLossPrice: 9000, 
  reduceOnly: true
});

// Тейк-профит ордер
let tp = await createOrder('BTC/USDT', 'market', 'sell', 0.01, 11000, {
  takeProfitPrice: 11000, 
  reduceOnly: true
});
```

### cancelOrder()

Отменяет ордер.

```typescript
function cancelOrder(id: string, symbol: string): Promise<Order>;
```

**CCXT функция:** `cancelOrder(id, symbol)`

### modifyOrder()

Изменяет существующий ордер.

```typescript
function modifyOrder(
  id: string,
  symbol: string,
  type: OrderType,
  side: OrderSide,
  amount: number,
  price: number,
  params = {}
): Promise<Order>;
```

**CCXT функция:** `editOrder(id, symbol, type, side, amount, price, params)`

**Пример использования:**
```typescript
let order = await modifyOrder('5203624294025367390', 'BTC/USDT:USDT', 'limit', 'buy', 0.01, 10000);
```

## Функции тестирования

### getFee()

Возвращает общую комиссию за все исполненные ордера (только для тестера).

```typescript
function getFee(): number;
```

### getProfit()

Возвращает прибыль/убыток по всем закрытым позициям (только для тестера).

```typescript
function getProfit(): Promise<number>;
```

## Системные функции

### SDK функции

```typescript
async function sdkCall(method: string, args: any[]): Promise<any>;
async function sdkGetProp(property: string): Promise<any>;
async function sdkSetProp(property: string, value: any): Promise<void>;
```

**Назначение:** Эти функции позволяют вызывать любые CCXT методы и работать с их свойствами, которые не были вынесены в глобальный контекст. Таким образом, можно получить доступ ко всему функционалу CCXT библиотеки, даже если конкретные методы не представлены как отдельные нативные функции.

**Примеры использования:**
```typescript
// Вызов любого CCXT метода
let result = await sdkCall('fetchTradingFees', ['BTC/USDT']);

// Получение свойства CCXT объекта
let markets = await sdkGetProp('markets');

// Установка свойства CCXT объекта
await sdkSetProp('sandbox', true);
```

### forceStop()

Принудительно останавливает выполнение скрипта.

```typescript
function forceStop(): void;
```

### systemUsage()

Возвращает информацию об использовании системных ресурсов.

```typescript
function systemUsage(): { cpu: number; memory: number };
```

### getErrorTrace()

Получает трассировку ошибки.

```typescript
function getErrorTrace(stack: string): Promise<string>;
```

### getUserId()

Возвращает ID пользователя.

```typescript
const getUserId: () => string;
```

## Глобальные объекты

### ARGS

Глобальная константа, содержащая аргументы скрипта.

```typescript
const ARGS: GlobalARGS;
```

### axios

Глобальный экземпляр HTTP-клиента для внешних запросов.

```typescript
const axios: any;
```

## Заключение

Нативные функции JT-Trader предоставляют мощный и унифицированный интерфейс для разработки торговых стратегий. Они абстрагируют сложность работы с различными биржами и предоставляют единообразный API для всех торговых операций, работы с рыночными данными и системными функциями.

При разработке стратегий важно учитывать особенности каждой функции, правильно обрабатывать ошибки и использовать соответствующие проверки для разных режимов выполнения (тестирование vs реальная торговля).
