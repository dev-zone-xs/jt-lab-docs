---
id: exchange-orders-basket
title: Работа с биржей (OrdersBasket)
sidebar_label: OrdersBasket
---

# Работа с биржей (OrdersBasket)

**OrdersBasket** — универсальный класс для работы с ордерами на бирже, предназначенный для упрощения и автоматизации торговли. Он объединяет функциональность создания, изменения и отмены различных типов ордеров, включая market, limit, stop-loss, take-profit и trigger ордера.

## Основные возможности

- **Создание и управление ордерами** — поддерживает market, limit, reduce-only, stop-loss и take-profit ордера
- **Триггерные ордера** — возможность локального хранения и активации ордеров при достижении указанной цены
- **Автоматическое управление стопами** — автоматически отменяет связанные стоп-ордера (SL/TP) при исполнении одного из них
- **Hedge режим** — поддерживает открытие позиций в обе стороны одновременно при включенном hedge режиме
- **Упрощенные методы торговли** — функции `buyMarket`, `sellMarket`, `buyLimit`, `sellLimit` с автоматической установкой SL/TP
- **Расчет объемов** — конвертирует USD суммы в контракты и обратно
- **Доступ к рыночным данным** — получение bid/ask цен, объемов, high/low/open/close значений
- **Модификация и отмена ордеров** — изменение цены, размера и других параметров существующих ордеров
- **Управление подписками** — отписка от глобальных событий и отмена всех активных триггеров

## События

- **`onOrderChange`** — вызывается при изменении статуса ордера (создан, исполнен, отменен, изменен)
- **`onPnlChange`** — вызывается при изменении нереализованной или реализованной прибыли/убытка по позиции
- **`onTick`** — вызывается при поступлении нового тика рыночных данных

## Подключение к бирже

### Конструктор

```typescript
const ordersBasket = new OrdersBasket({
  symbol: 'ETH/USDT',
  connectionName: 'binance',
  hedgeMode: true,
  prefix: 'myBot',
  triggerType: 'script',
  leverage: 10
});
```

**Параметры:**
- `symbol` — торговый символ (например, 'ETH/USDT') **[обязательный]**
- `connectionName` — название подключения к бирже (по умолчанию берется из `this.connectionName`)
- `hedgeMode?` — определяет, включен ли режим открытия позиций в обе стороны (по умолчанию: `false`)
- `prefix?` — префикс для генерации clientOrderId (по умолчанию: случайный 4-символьный ID)
- `triggerType?` — метод создания стоп-ордеров ('script' или 'exchange') (по умолчанию: `'script'`)
- `leverage?` — плечо биржи (по умолчанию: `1`)

### Значения по умолчанию

OrdersBasket использует следующие значения по умолчанию:

- **`hedgeMode`**: `false` — обычный режим торговли (одна позиция на символ)
- **`prefix`**: случайный 4-символьный ID — уникальный префикс для всех ордеров
- **`triggerType`**: `'script'` — стоп-ордера управляются локально
- **`leverage`**: `1` — без плеча (спот торговля)
- **`connectionName`**: берется из `this.connectionName` — настройки JT-Trader

### Инициализация

```typescript
await ordersBasket.init();
```

После инициализации OrdersBasket готов к работе с биржей.

### Интеграция с BaseScript

OrdersBasket обычно используется внутри торговых скриптов, наследующих от `BaseScript`:

```typescript
class MyTradingScript extends BaseScript {
  async onInit() {
    // Создаем OrdersBasket для первого символа из списка
    this.basket = new OrdersBasket({
      symbol: this.symbols[0], // первый символ из настроек JT-Trader
      connectionName: this.connectionName, // подключение из настроек
      leverage: getArgNumber('leverage', 1),
      hedgeMode: getArgBoolean('hedgeMode', false)
    });
    
    await this.basket.init();
  }

  async onTick() {
    // Используем basket для торговли
    const price = this.basket.close();
    // ... логика торговли
  }
}
```

**Важные моменты:**
- **`this.symbols[0]`** — первый символ из списка, переданного в JT-Trader
- **`this.connectionName`** — название подключения к бирже из настроек сценария
- **JT-Trader** автоматически передает все параметры через глобальную переменную `ARGS`

### Как JT-Trader запускает скрипты

JT-Trader ищет в файле скрипта класс, наследующий от `BaseScript`, и запускает его:

```typescript
// Файл: my-strategy.ts
class Script extends BaseScript {  // ← JT-Trader ищет именно этот класс
  async onInit() {
    this.basket = new OrdersBasket({
      symbol: this.symbols[0], // символы из настроек Runtime/Tester
      connectionName: this.connectionName, // подключение из настроек
      leverage: getArgNumber('leverage', 1)
    });
    await this.basket.init();
  }

  async onTick() {
    // Логика торговли
  }
}
```

**Параметры из JT-Trader:**
- **Runtime** — параметры передаются через интерфейс "Create Runtime"
- **Tester** — параметры передаются через интерфейс "New Scenario"
- **Все параметры** доступны через функции `getArgString()`, `getArgNumber()`, `getArgBoolean()`

## Расчеты и конвертации

### Важность правильных расчетов

**Критически важно** понимать разницу между спот-торговлей и фьючерсной торговлей:

- **Спот торговля** — используются монеты (например, 0.1 BTC)
- **Фьючерсная торговля** — используются контракты с размером контракта (contractSize)

### Размер контракта (contractSize)

Каждый фьючерсный символ имеет свой размер контракта:
- **BTC/USDT** — contractSize = 0.001 (1 контракт = 0.001 BTC)
- **ETH/USDT** — contractSize = 0.01 (1 контракт = 0.01 ETH)
- **XRP/USDT** — contractSize = 10 (1 контракт = 10 XRP)

### Конвертация объемов

```typescript
// USD в контракты
const contracts = ordersBasket.getContractsAmount(100, 2200); // 100 USD по цене 2200
// Результат: количество контрактов для покупки на 100 USD

// Контракты в USD  
const usdAmount = ordersBasket.getUsdAmount(1, 2200); // 1 контракт по цене 2200
// Результат: стоимость 1 контракта в USD
```

### Примеры расчетов

```typescript
// Для BTC/USDT (contractSize = 0.001, цена = 50000)
const contracts = ordersBasket.getContractsAmount(100, 50000);
// Результат: 2 контракта (100 / 50000 / 0.001 = 2)

const usdValue = ordersBasket.getUsdAmount(2, 50000);  
// Результат: 100 USD (2 * 50000 * 0.001 = 100)

// Для XRP/USDT (contractSize = 10, цена = 0.5)
const contracts = ordersBasket.getContractsAmount(100, 0.5);
// Результат: 20 контрактов (100 / 0.5 / 10 = 20)

const usdValue = ordersBasket.getUsdAmount(20, 0.5);
// Результат: 100 USD (20 * 0.5 * 10 = 100)
```

### Правильное использование в торговле

```typescript
// ❌ НЕПРАВИЛЬНО - работаем с монетами напрямую
await ordersBasket.buyMarket(0.1); // 0.1 чего? BTC или контрактов?

// ✅ ПРАВИЛЬНО - конвертируем USD в контракты
const usdAmount = 100; // хотим купить на 100 USD
const contracts = ordersBasket.getContractsAmount(usdAmount, ordersBasket.close());
await ordersBasket.buyMarket(contracts);
```

## Торговые операции

### Создание ордеров

#### Market ордера

```typescript
// Покупка по рынку на 100 USD
const usdAmount = 100;
const contracts = ordersBasket.getContractsAmount(usdAmount, ordersBasket.close());
const buyOrder = await ordersBasket.buyMarket(contracts, 2150, 2300); // contracts, SL, TP

// Продажа по рынку на 50 USD
const sellContracts = ordersBasket.getContractsAmount(50, ordersBasket.close());
const sellOrder = await ordersBasket.sellMarket(sellContracts, 2300, 2150); // contracts, SL, TP
```

#### Limit ордера

```typescript
// Покупка по лимиту на 100 USD
const usdAmount = 100;
const contracts = ordersBasket.getContractsAmount(usdAmount, 2200);
const buyLimitOrder = await ordersBasket.buyLimit(contracts, 2200, 2150, 2300); // contracts, price, SL, TP

// Продажа по лимиту на 50 USD
const sellContracts = ordersBasket.getContractsAmount(50, 2200);
const sellLimitOrder = await ordersBasket.sellLimit(sellContracts, 2200, 2300, 2150); // contracts, price, SL, TP
```

#### Универсальное создание ордеров

```typescript
// Создание любого типа ордера на 100 USD
const usdAmount = 100;
const contracts = ordersBasket.getContractsAmount(usdAmount, ordersBasket.close());
const order = await ordersBasket.createOrder('market', 'buy', contracts, ordersBasket.close(), {
  tp: 2300,  // Take Profit
  sl: 2150   // Stop Loss
});
```

### Управление ордерами

#### Отмена ордера

```typescript
await ordersBasket.cancelOrder(order.id);
```

#### Модификация ордера

```typescript
const modifiedOrder = await ordersBasket.modifyOrder(
  order.id, 
  'limit', 
  'buy', 
  1.5,    // новый размер
  2250    // новая цена
);
```

#### Отмена всех ордеров

```typescript
await ordersBasket.cancelAllOrders();
```

### Специальные типы ордеров

#### Reduce-only ордера (закрытие позиции)

```typescript
// Закрытие long позиции на 50 USD
const closeAmount = 50;
const contracts = ordersBasket.getContractsAmount(closeAmount, ordersBasket.close());
const reduceOrder = await ordersBasket.createReduceOrder(
  'market', 
  'long',  // закрываем long позицию
  contracts, // размер в контрактах
  ordersBasket.close() // цена
);
```

#### Stop Loss ордера

```typescript
// Stop Loss для позиции на 100 USD
const positionSize = 100;
const contracts = ordersBasket.getContractsAmount(positionSize, ordersBasket.close());
const slOrder = await ordersBasket.createStopLossOrder(
  'buy',   // сторона ордера для закрытия
  contracts, // размер в контрактах
  2150     // цена срабатывания
);
```

#### Take Profit ордера

```typescript
// Take Profit для позиции на 100 USD
const positionSize = 100;
const contracts = ordersBasket.getContractsAmount(positionSize, ordersBasket.close());
const tpOrder = await ordersBasket.createTakeProfitOrder(
  'buy',   // сторона ордера для закрытия
  contracts, // размер в контрактах
  2300     // цена срабатывания
);
```

#### Триггерные ордера

```typescript
// Триггерный ордер на покупку на 100 USD при достижении цены 2150
const usdAmount = 100;
const contracts = ordersBasket.getContractsAmount(usdAmount, 2200);
const triggeredOrder = await ordersBasket.createTriggeredOrder(
  'market', 
  'buy', 
  contracts, // размер в контрактах
  2200,     // цена ордера
  2150      // цена срабатывания
);
```

## Получение данных

### Рыночные данные

```typescript
// Текущие цены
const currentPrice = ordersBasket.close();
const askPrice = ordersBasket.ask();
const bidPrice = ordersBasket.bid();

// Объемы
const askVolume = ordersBasket.askVolume();
const bidVolume = ordersBasket.bidVolume();

// OHLC данные
const high = ordersBasket.high();
const low = ordersBasket.low();
const open = ordersBasket.open();
const volume = ordersBasket.volume();
```

### Позиции

```typescript
// Получение всех позиций
const positions = await ordersBasket.getPositions();

// Получение позиции по стороне
const longPosition = await ordersBasket.getPositionBySide('long');
const shortPosition = await ordersBasket.getPositionBySide('short');

// Закрытие позиции на 50 USD
const closeAmount = 50;
const contracts = ordersBasket.getContractsAmount(closeAmount, ordersBasket.close());
await ordersBasket.closePosition('long', contracts); // сторона, размер в контрактах
```

### Ордера

```typescript
// Открытые ордера
const openOrders = await ordersBasket.getOpenOrders();

// Закрытые ордера
const closedOrders = await ordersBasket.getClosedOrders();

// Все ордера
const allOrders = await ordersBasket.getOrders();

// Расширенная информация об ордерах
const extendedOrders = ordersBasket.getExtendedOrders();
```

### Информация о рынке

```typescript
// Краткая информация о рынке
const marketInfo = await ordersBasket.marketInfoShort();
// Возвращает: symbol, close, buyContracts, buySizeUsd, sellContracts, sellSizeUsd, leverage
```



## Тестовая биржа

### Mock биржа для тестирования

OrdersBasket поддерживает работу с Mock биржей для тестирования стратегий:

```typescript
const testBasket = new OrdersBasket({
  symbol: 'BTC/USDT',
  connectionName: 'mock',  // Mock биржа
  hedgeMode: false
});

await testBasket.init();
```

### Особенности тестирования

- **Симуляция исполнения** — ордера исполняются мгновенно по текущей цене
- **Эмуляция позиций** — автоматическое отслеживание позиций
- **Логирование** — подробные логи всех операций
- **Безопасность** — никаких реальных денег не используется

### Пример тестирования стратегии

```typescript
class TestStrategy extends BaseScript {
  async onInit() {
    this.basket = new OrdersBasket({
      symbol: 'BTC/USDT',
      connectionName: 'mock'
    });
    await this.basket.init();
  }

  async onTick() {
    const price = this.basket.close();
    
    // Простая стратегия: покупаем при падении, продаем при росте
    if (price < 50000) {
      await this.basket.buyMarket(0.1, 49000, 52000);
    } else if (price > 55000) {
      await this.basket.sellMarket(0.1, 56000, 53000);
    }
  }
}
```

## Управление триггерами

### Типы триггеров

OrdersBasket поддерживает два типа управления стоп-ордерами:

#### Script триггеры (по умолчанию)
- Стоп-ордера хранятся локально
- Активируются при достижении цены
- Больше контроля и гибкости

#### Exchange триггеры
- Стоп-ордера создаются сразу на бирже
- Управляются биржей
- Гарантированное исполнение при подключении

```typescript
// Script триггеры (по умолчанию)
const scriptBasket = new OrdersBasket({
  symbol: 'ETH/USDT',
  triggerType: 'script'
});

// Exchange триггеры
const exchangeBasket = new OrdersBasket({
  symbol: 'ETH/USDT', 
  triggerType: 'exchange'
});
```

## Очистка ресурсов

```typescript
// Отписка от событий и отмена триггеров
ordersBasket.unsubscribe();
```

## Практические примеры

### Грид-стратегия

```typescript
class GridStrategy extends BaseScript {
  async onInit() {
    this.basket = new OrdersBasket({
      symbol: this.symbols[0], // первый символ из настроек JT-Trader
      connectionName: this.connectionName, // подключение из настроек
      leverage: getArgNumber('leverage', 1)
    });
    await this.basket.init();
    
    this.gridStep = getArgNumber('gridStep', 100); // шаг грида из параметров
    this.gridSize = getArgNumber('gridSize', 5);   // количество уровней из параметров
  }

  async onTick() {
    const price = this.basket.close();
    const openOrders = await this.basket.getOpenOrders();
    
    // Создаем грид ордеров на 10 USD каждый
    const orderSize = 10;
    for (let i = 1; i <= this.gridSize; i++) {
      const buyPrice = price - (this.gridStep * i);
      const sellPrice = price + (this.gridStep * i);
      
      const buyContracts = this.basket.getContractsAmount(orderSize, buyPrice);
      const sellContracts = this.basket.getContractsAmount(orderSize, sellPrice);
      
      await this.basket.buyLimit(buyContracts, buyPrice);
      await this.basket.sellLimit(sellContracts, sellPrice);
    }
  }
}
```

### DCA стратегия

```typescript
class DCAStrategy extends BaseScript {
  async onInit() {
    this.basket = new OrdersBasket({
      symbol: this.symbols[0], // первый символ из настроек JT-Trader
      connectionName: this.connectionName, // подключение из настроек
      leverage: getArgNumber('leverage', 1)
    });
    await this.basket.init();
    
    this.dcaLevels = getArgString('dcaLevels', '2000,1900,1800,1700').split(',').map(Number);
    this.positionSize = getArgNumber('positionSize', 100); // размер позиции в USD
  }

  async onTick() {
    const price = this.basket.close();
    const longPosition = await this.basket.getPositionBySide('long');
    
    // Покупаем на каждом уровне DCA
    for (const level of this.dcaLevels) {
      if (price <= level && longPosition.contracts === 0) {
        const contracts = this.basket.getContractsAmount(this.positionSize, price);
        await this.basket.buyMarket(contracts, level * 0.95, level * 1.1);
        break;
      }
    }
  }
}
```

OrdersBasket предоставляет мощный и гибкий инструмент для работы с биржами, объединяя все необходимые функции для создания сложных торговых стратегий.
