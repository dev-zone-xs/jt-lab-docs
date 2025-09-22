---
slug: opening-orders-complete-guide
title: Полное руководство по открытию ордеров в JT-Lib
authors: [jt-lab-team]
tags: [tutorial, jt-lib, trading]
draft: false
date: 2025-09-18
---

<!-- truncate -->

# Полное руководство по открытию ордеров в JT-Lib

[GitHub](https://github.com/jt-lab) | [Документация](https://docs.jt-lab.com) | [JT-Lib](https://github.com/jt-lab/jt-lib)

## Введение

Открытие ордеров — это основа любой торговой стратегии. В JT-Lib этот процесс максимально упрощен благодаря классу **OrdersBasket**, который предоставляет универсальный интерфейс для работы с различными типами ордеров на криптобиржах. 

:::info
**Важно:** Данное руководство рассматривает работу с фьючерсными контрактами — производными инструментами от базовых криптоактивов. В отличие от спотовой торговли, фьючерсы позволяют торговать с плечом, открывать короткие позиции и использовать более сложные торговые стратегии.
:::

### Особенности фьючерсной торговли

На криптобиржах фьючерсы имеют специфические параметры, которые можно получить через `symbolInfo`:

- **Размер контракта** (`contractSize`) — минимальная единица торговли (например, 0.001 BTC)
- **Точность количества** (`precision.amount`) — минимальный шаг изменения размера позиции
- **Лимиты** (`limits`) — минимальные и максимальные значения для размера, цены и стоимости
- **Маржинальная торговля** — возможность торговать с плечом, используя залог
- **Финансирование** — периодические платежи между длинными и короткими позициями
- **Режим позиций** — возможность открывать позиции в обе стороны одновременно (hedge mode)

```typescript
// Получение информации о символе
const symbolInfo = await symbolInfo('BTC/USDT:USDT');

// Извлекаем ключевые параметры в константы для дальнейшего использования
const contractSize = symbolInfo.contractSize;
const amountPrecision = symbolInfo.precision.amount;
const minAmount = symbolInfo.limits.amount.min;
const maxAmount = symbolInfo.limits.amount.max;

log('SymbolInfo', 'Параметры фьючерсного контракта', {
  contractSize,
  amountPrecision,
  minAmount,
  maxAmount
});
```

### Режим позиций (Hedge Mode)

На некоторых биржах можно открывать позиции в обе стороны одновременно (длинную и короткую). Для этого нужно настроить режим позиций:

```typescript
const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
  hedgeMode: true  // Включает режим хеджирования
});
await basket.init();

// Теперь можно открывать позиции в обе стороны
await basket.buyMarket(contracts);   // Длинная позиция
await basket.sellMarket(contracts);  // Короткая позиция
```

:::info
**Важно:** При включении `hedgeMode: true` в OrdersBasket, все необходимые настройки `positionMode` на бирже будут выполнены автоматически. На разных биржах этот параметр может называться по-разному, но OrdersBasket унифицирует эту логику.
:::

### Сигнатура функции symbolInfo

```typescript
function symbolInfo(symbol: string): Promise<SymbolInfo>;
```

**Параметры:**
- `symbol` - торговый символ (например, 'BTC/USDT:USDT')

**Возвращает:** `Promise<SymbolInfo>` - объект с информацией о символе

### Структура SymbolInfo

```typescript
interface SymbolInfo {
  // Основная информация
  id: string;                    // Уникальный ID символа (например, "BTCUSDT")
  symbol: string;                // Торговый символ (например, "BTC/USDT:USDT")
  base: string;                  // Базовая валюта (например, "BTC")
  quote: string;                 // Котируемая валюта (например, "USDT")
  settle: string;                // Валюта расчетов (например, "USDT")
  
  // Тип контракта
  type: string;                  // Тип: "spot", "swap", "future", "option"
  spot: boolean;                 // Спотовая торговля
  swap: boolean;                 // Своп-контракты (фьючерсы)
  future: boolean;               // Фьючерсы
  option: boolean;               // Опционы
  contract: boolean;             // Является ли контрактом
  
  // Характеристики контракта
  linear: boolean;               // Линейный контракт (true) или обратный (false)
  inverse: boolean;              // Обратный контракт
  contractSize: number;          // Размер контракта (например, 0.0001 для BTC)
  
  // Точность и лимиты
  precision: {
    amount: number;              // Точность количества (например, 1 или 0.001)
    price: number;               // Точность цены (например, 0.1)
    base: number;                // Точность базовой валюты
    quote: number;               // Точность котируемой валюты
  };
  
  limits: {
    amount: {
      min: number;               // Минимальный размер позиции
      max: number;               // Максимальный размер позиции
    };
    price: {
      min: number;               // Минимальная цена
      max: number;               // Максимальная цена
    };
    cost: {
      min: number;               // Минимальная стоимость ордера
      max: number;               // Максимальная стоимость ордера
    };
    leverage: {
      min: number;               // Минимальное плечо
      max: number;               // Максимальное плечо
    };
  };
  
  // Комиссии
  taker: number;                 // Комиссия тейкера (например, 0.0006 = 0.06%)
  maker: number;                 // Комиссия мейкера (например, 0.0001 = 0.01%)
  
  // Статус
  active: boolean;               // Активен ли символ для торговли
  margin: boolean;               // Поддерживает ли маржинальную торговлю
  tierBased: boolean;            // Использует ли тарифные планы
}
```

Эти параметры критически важны при расчете размера позиции и открытии ордеров, так как все значения должны соответствовать требованиям биржи.

### Практические примеры расчета контрактов

Рассмотрим, как рассчитать количество контрактов для открытия позиции на $100 на разных биржах:

#### Gate.io (BTC/USDT:USDT)
```typescript
// Параметры Gate.io
const contractSize = 0.0001;  // 1 контракт = 0.0001 BTC
const amountPrecision = 1;    // минимальный шаг = 1 контракт

// Расчет для позиции на $100 при цене $50,000
const usdAmount = 100;
const currentPrice = 50000;

// Формула: количество_контрактов = usd_amount / (цена * размер_контракта)
const contracts = usdAmount / (currentPrice * contractSize);
// contracts = 100 / (50000 * 0.0001) = 100 / 5 = 20 контрактов

// Округляем до целого числа (precision.amount = 1)
const finalContracts = Math.floor(contracts); // 20 контрактов

log('Gate.io', 'Расчет контрактов', {
  usdAmount,
  currentPrice,
  contractSize,
  calculatedContracts: contracts,
  finalContracts,
  actualUsdValue: finalContracts * currentPrice * contractSize // $100
});
```

#### Bybit (BTC/USDT:USDT)
```typescript
// Параметры Bybit
const contractSize = 1;       // 1 контракт = 1 USD
const amountPrecision = 0.001; // минимальный шаг = 0.001 контракта

// Расчет для позиции на $100 при цене $50,000
const usdAmount = 100;
const currentPrice = 50000;

// Формула: количество_контрактов = usd_amount / (цена * размер_контракта)
const contracts = usdAmount / (currentPrice * contractSize);
// contracts = 100 / (50000 * 1) = 100 / 50000 = 0.002 контракта

// Округляем до 3 знаков после запятой (precision.amount = 0.001)
const finalContracts = Math.floor(contracts * 1000) / 1000; // 0.002 контракта

log('Bybit', 'Расчет контрактов', {
  usdAmount,
  currentPrice,
  contractSize,
  calculatedContracts: contracts,
  finalContracts,
  actualUsdValue: finalContracts * currentPrice * contractSize // $100
});
```

### Ключевые различия бирж
BTC = $50 000

| Параметр | Gate.io | Bybit |
|----------|---------|-------|
| **contractSize** | 0.0001 (BTC) | 1 (BTC) |
| **amountPrecision** | 1 контракт | 0.001 контракта |
| **Минимальная позиция** | 1 контракт (~$5) | 0.001 контракта (~$50) |

:::info
**Минимальная позиция растет вместе с ценой актива!** Это критически важно учитывать в торговых роботах.

**Пример:** Если вы начинали с минимальной позиции в $5 при цене BTC $50,000, то при росте цены до $100,000 ваша минимальная позиция уже будет $10. Это может привести к ошибкам в работе робота, если он не учитывает динамическое изменение минимальных лимитов.
:::

```typescript

const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
});
await basket.init();

const usdAmount = 100; // Хотим купить на $100
let contracts = basket.getContractsAmount(usdAmount); //для текущей цены
await basket.buyMarket(contracts);

// Limit ордер - исполняется по указанной цене
const limitPrice = basket.price()*0.7 // ниже на 30%
let contracts = basket.getContractsAmount(usdAmount,limitPrice); //для триггерной цены
await basket.buyLimit(contracts, limitPrice);

```

## Рыночные ордера (Market Orders)

Рыночные ордера исполняются немедленно по текущей рыночной цене.

```typescript
const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
});
await basket.init();

// Покупка
const usdAmount = 100;
const contracts = basket.getContractsAmount(usdAmount);
await basket.buyMarket(contracts);

// Продажа
await basket.sellMarket(contracts);
```

## Лимитные ордера (Limit Orders)

Лимитные ордера исполняются только по указанной цене или лучше.


```typescript
const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
});
await basket.init();

const usdAmount = 100;
const currentPrice = basket.price();

// Покупка по цене ниже текущей
const buyPrice = currentPrice * 0.98; // -2%
const contracts = basket.getContractsAmount(usdAmount, buyPrice);
await basket.buyLimit(contracts, buyPrice);

// Продажа по цене выше текущей
const sellPrice = currentPrice * 1.02; // +2%
await basket.sellLimit(contracts, sellPrice);
```

## Стоп-лоссы и тейк-профиты

Стоп-лосс (Stop Loss) и тейк-профит (Take Profit) — это триггерные ордера, которые автоматически срабатывают при достижении определенных ценовых уровней и закрывают позицию.


### Как работают триггерные ордера

1. **Ожидание триггера** — ордер ждет достижения указанной цены
2. **Срабатывание** — при достижении триггерной цены ордер активируется
3. **Автоматическое размещение** — система автоматически создает рыночный ордер противоположного направления
4. **Закрытие позиции** — рыночный ордер исполняется по лучшей доступной цене

:::warning
**Важно понимать:** При открытии стоп-лосса и тейк-профита одновременно, при срабатывании одного ордера второй нужно отменять вручную. Биржа сама за этим не следит. 

**Критическое ограничение:** Тип триггера `'exchange'` не унифицирован между биржами. Каждая биржа работает с триггерными ордерами по-своему:

- **Некоторые биржи** не считают стоп-лоссы и тейк-профиты обычными ордерами
- **API разных бирж** возвращает триггерные ордера в разных форматах или вообще не возвращает их в общем списке ордеров
- **Логика срабатывания** может кардинально отличаться между платформами
- **Под каждую биржу** требуется писать собственный обработчик для работы со стоп-лоссами и тейк-профитами

Поэтому при выборе `triggerType: 'exchange'` будьте готовы к необходимости адаптации кода под специфику конкретной биржи.
:::

:::info
**triggerType** — тип триггера для стоп-лоссов и тейк-профитов:

- **`'exchange'`** — ордера создаются на бирже
- **`'script'`** — триггеры обрабатываются клиентом (JT-Lib)
:::

**Рекомендация:** Выбирайте тип триггера в зависимости от задачи:

**Используйте `'script'` когда** есть сложная логика при закрытии позиций и нужно переоткрывать ордера после срабатывания триггеров. Этот тип подходит, когда робот должен быть активен для выполнения дополнительных действий и требуется полный контроль над процессом закрытия позиции. 

**Используйте `'exchange'` когда** нужна максимальная надежность и робот может быть отключен. Этот тип подходит для простых стратегий без сложной логики при закрытии позиций, когда критично важно ограничить убытки. Триггеры будут срабатывать на бирже даже при отключении клиента.





### Открытие стоп-лосса и тэйк профита 

```typescript
const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
  triggerType: 'exchange' // Триггеры обрабатываются биржей
});
await basket.init();

// Сначала открываем позицию
const usdAmount = 100;
const contracts = basket.getContractsAmount(usdAmount);

// Расчет стоп-лосса и тейк-профита
const currentPrice = basket.price();
const stopLossPercent = 5; // 5% убытка
const takeProfitPercent = 4; // 4% прибыли

const sl = currentPrice * (1 - stopLossPercent / 100); // Стоп-лосс
const tp = currentPrice * (1 + takeProfitPercent / 100); // Тейк-профит

// Market ордер с автоматическими стоп-лоссом и тейк-профитом
const order = await basket.buyMarket(contracts, sl, tp);

```

### Прямое создание стоп-лосса и тейк-профита на бирже

```typescript
// Стоп-лосс ордер (создается напрямую на бирже)
await basket.createStopLossOrder('sell', contracts, sl);

// Тейк-профит ордер (создается напрямую на бирже)
await basket.createTakeProfitOrder('sell', contracts, tp);
```

### Лимитный ордер с триггерными ордерами

При использовании лимитных ордеров логика работы с триггерными ордерами (стоп-лосс и тейк-профит) отличается от рыночных ордеров:

1. **Создается лимитный ордер** — ожидает исполнения по указанной цене
2. **Создается задача** — на установку стоп-лосс и тейк-профит ордеров после исполнения
3. **При исполнении лимитного ордера** — автоматически устанавливаются стоп-лосс и тейк-профит

```typescript
const basket = new OrdersBasket({
  symbol: 'BTC/USDT:USDT',
  triggerType: 'exchange'
});
await basket.init();

const usdAmount = 100;
const currentPrice = basket.price();

// Цена для лимитного ордера (ниже текущей на 2%)
const limitPrice = currentPrice * 0.98;

// Расчет триггерных ордеров от цены лимитного ордера
const stopLossPercent = 5; // 5% убытка от цены входа
const takeProfitPercent = 4; // 4% прибыли от цены входа

const sl = limitPrice * (1 - stopLossPercent / 100); // Стоп-лосс
const tp = limitPrice * (1 + takeProfitPercent / 100); // Тейк-профит

const contracts = basket.getContractsAmount(usdAmount, limitPrice);

// Лимитный ордер с автоматическими триггерными ордерами
const order = await basket.buyLimit(contracts, limitPrice, sl, tp);

log('LimitOrder', 'Лимитный ордер с защитой', {
  currentPrice,
  limitPrice,
  stopLoss: sl,
  takeProfit: tp,
  stopLossPercent: `${stopLossPercent}%`,
  takeProfitPercent: `${takeProfitPercent}%`,
  contracts,
  orderId: order.id
});
```

:::info
**Важно:** При лимитных ордерах триггерные ордера (стоп-лосс и тейк-профит) устанавливаются только после исполнения основного ордера. До этого момента позиция не существует, поэтому защитные ордера не могут быть активны.
:::

:::info
**Важно:** Стоп-лоссы и тейк-профиты работают только при наличии открытой позиции. Если позиция закрыта, эти ордера автоматически отменяются.
:::

## Закрытие позиций

### Специальные функции OrdersBasket

```typescript
// Закрытие позиции по стороне
await basket.closePosition('long', contracts);  // закрыть длинную позицию
await basket.closePosition('short', contracts); // закрыть короткую позицию

// Получение позиций
const longPosition = await basket.getPositionBySide('long');
const shortPosition = await basket.getPositionBySide('short');
```

### Reduce-only ордера для закрытия

```typescript
// Рыночное закрытие длинной позиции
const reduceOrder = await basket.createReduceOrder(
  'market', 
  'long',  // закрыть длинную позицию
  contracts,
  basket.close()
);

// Рыночное закрытие короткой позиции
const reduceOrderShort = await basket.createReduceOrder(
  'market', 
  'short',  // закрыть короткую позицию
  contracts,
  basket.close()
);

// Лимитное закрытие длинной позиции
const limitCloseOrder = await basket.createReduceOrder(
  'limit', 
  'long',
  contracts,
  basket.close() * 1.01  // +1% от текущей цены
);
```

## Отмена ордеров

### Отмена конкретного ордера

```typescript
// Отмена ордера по ID
await basket.cancelOrder(orderId);
```

### Отмена всех ордеров

```typescript
// Отмена всех открытых ордеров
await basket.cancelAllOrders();
```


## Универсальная функция createOrder

Все рассмотренные выше ордера можно создать через универсальную функцию `createOrder` с особыми параметрами:

```typescript
// Рыночный ордер на покупку
await basket.createOrder('market', 'buy', contracts, basket.ask());

// Лимитный ордер на продажу
await basket.createOrder('limit', 'sell', contracts, basket.bid());

// Reduce-only ордер для закрытия позиции
await basket.createOrder('market', 'buy', contracts, basket.price(), {
  reduceOnly: true
});

// Стоп-лосс ордер через createOrder
await basket.createOrder('market', 'sell', contracts, basket.price(), {
  tp:stopLossPrice
});

// Тейк-профит ордер через createOrder
await basket.createOrder('market', 'sell', contracts, basket.price(), {
  sl:takeProfitPrice
});

// Триггерный рыночный ордер (исполняется при достижении цены)
await basket.createOrder('market', 'buy', contracts, basket.price(), {
  triggerPrice: 50000  // цена срабатывания триггера
});

// Триггерный лимитный ордер (размещается по указанной цене при срабатывании)
await basket.createOrder('limit', 'buy', contracts, 49500, {
  triggerPrice: 50000  // цена срабатывания триггера
});

// Ордер с защитными уровнями (внутренние параметры OrdersBasket)
await basket.createOrder('market', 'buy', contracts, basket.price(), {
  sl: stopLossPrice,  // автоматически создаст связанный стоп-лосс
  tp: takeProfitPrice // автоматически создаст связанный тейк-профит
});
```

В данном руководстве мы подробно разобрали все аспекты работы с ордерами: от базовых market-ордеров до сложных триггерных систем.




