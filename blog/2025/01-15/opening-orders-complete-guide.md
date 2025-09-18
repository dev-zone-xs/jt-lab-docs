---
slug: opening-orders-complete-guide
title: Полное руководство по открытию ордеров в JT-Lib
authors: [jt-lab-team]
tags: [jt-lib, orders, trading, automation, orders-basket, market-orders, limit-orders, stop-loss, take-profit, tutorial, complete-guide]
draft: false
---

# Полное руководство по открытию ордеров в JT-Lib

[GitHub](https://github.com/jt-lab) | [Документация](https://docs.jt-lab.com) | [JT-Lib](https://github.com/jt-lab/jt-lib)

## Введение

Открытие ордеров — это основа любой торговой стратегии. В JT-Lib этот процесс максимально упрощен благодаря классу **OrdersBasket**, который предоставляет универсальный интерфейс для работы с различными типами ордеров на криптобиржах. 

:::info
**Важно:** Данное руководство рассматривает работу с фьючерсными контрактами, а не с спотовой торговлей. Фьючерсы — это производные финансовые инструменты, представляющие собой контракты на покупку или продажу базового актива по определенной цене в будущем.
:::

### Особенности фьючерсной торговли

На криптобиржах фьючерсы имеют специфические параметры, которые можно получить через `symbolInfo`:

- **Размер контракта** (`contractSize`) — минимальная единица торговли (например, 0.001 BTC)
- **Точность количества** (`precision.amount`) — минимальный шаг изменения размера позиции
- **Лимиты** (`limits`) — минимальные и максимальные значения для размера, цены и стоимости
- **Маржинальная торговля** — возможность торговать с плечом, используя залог
- **Финансирование** — периодические платежи между длинными и короткими позициями

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

| Параметр | Gate.io | Bybit |
|----------|---------|-------|
| **contractSize** | 0.0001 BTC | 1 USD |
| **amountPrecision** | 1 контракт | 0.001 контракта |
| **Минимальная позиция** | 1 контракт (~$5) | 0.001 контракта (~$0.05) |

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

## Стоп-лоссы и тейк-профиты

Стоп-лосс (Stop Loss) и тейк-профит (Take Profit) — это триггерные ордера, которые автоматически срабатывают при достижении определенных ценовых уровней и закрывают позицию.


### Как работают триггерные ордера

1. **Ожидание триггера** — ордер ждет достижения указанной цены
2. **Срабатывание** — при достижении триггерной цены ордер активируется
3. **Автоматическое размещение** — система автоматически создает рыночный ордер противоположного направления
4. **Закрытие позиции** — рыночный ордер исполняется по лучшей доступной цене

:::warning
**Важно понимать:** При открытии стоп-лосса и тейк-профита одновременно, при срабатывании одного ордера второй нужно отменять вручную. Биржа сама за этим не следит. OrdersBasket автоматически отменяет противоположный ордер при срабатывании одного из них. 
:::

:::info
**triggerType** — тип триггера для стоп-лоссов и тейк-профитов:

- **`'exchange'`** — ордера создаются на бирже
- **`'script'`** — триггеры обрабатываются клиентом (JT-Lib)

**Рекомендация:** Выбирайте тип триггера в зависимости от задачи:

**Используйте `'exchange'` когда** нужна максимальная надежность и робот может быть отключен. Этот тип подходит для простых стратегий без сложной логики при закрытии позиций, когда критично важно ограничить убытки. Триггеры будут срабатывать на бирже даже при отключении клиента.

**Используйте `'script'` когда** есть сложная логика при закрытии позиций и нужно переоткрывать ордера после срабатывания триггеров. Этот тип подходит, когда робот должен быть активен для выполнения дополнительных действий и требуется полный контроль над процессом закрытия позиции. 

:::


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

В данном руководстве мы подробно разберем все аспекты открытия ордеров: от базовых market-ордеров до сложных триггерных систем.




