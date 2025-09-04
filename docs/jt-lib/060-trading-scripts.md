---
id: trading-scripts
title: Торговые скрипты (Script)
sidebar_label: Торговые скрипты
---

# Торговые скрипты (Script)

Торговые скрипты являются основой для создания торговых стратегий в `jt-lib`. Они обеспечивают структурированный подход к разработке алгоритмических торговых систем с четким жизненным циклом и обработкой рыночных событий.

## Ваш первый торговый скрипт - DCA стратегия

**DCA (Dollar Cost Averaging)** - это стратегия регулярных покупок на фиксированную сумму независимо от цены. Это снижает влияние волатильности и позволяет накапливать активы постепенно.

Вот лаконичный пример DCA стратегии с использованием современных возможностей `jt-lib`:

```typescript
class Script extends BaseScript {
  static definedArgs = [
    { key: 'symbols', defaultValue: 'BTC/USDT:USDT' },
    { key: 'sizeUsd', defaultValue: 100 },
    { key: 'intervalHours', defaultValue: 168 },
  ];

  dcaBasket: OrdersBasket;
  sizeUsd = getArgNumber('sizeUsd', 100);
  intervalHours = getArgNumber('intervalHours', 168); // 168 hours = 1 week
  private reportLayout: StandardReportLayout;

  async onInit() {
    // Инициализируем стандартный отчет
    this.reportLayout = new StandardReportLayout();

    // Создаем корзину
    this.dcaBasket = new OrdersBasket({
      symbol: this.symbols[0],
    });
    await this.dcaBasket.init();

    // Регистрируем триггер покупки
    globals.triggers.registerTimeHandler('dcaPurchase', this.buyDCA, this);
    
    // Запускаем регулярные покупки
    globals.triggers.addTaskByTime({
      name: 'dcaPurchase',
      triggerTime: currentTime() + 60 * 1000, // Через 1 минуту
      interval: this.intervalHours * 60 * 60 * 1000, // Повторяем каждые intervalHours часов
      canReStore: true,
    });

    globals.report.setTitle('DCA Bot');
  }

  // Функция покупки
  buyDCA = async () => {
    const amount = this.dcaBasket.getContractsAmount(this.sizeUsd);
    await this.dcaBasket.buyMarket(amount);
    log('DCA покупка выполнена', `amount: ${amount}, price: ${this.dcaBasket.close()}`);
  };
}
```

**Ключевые особенности этого примера:**
1. **`static definedArgs`** - автоматическая генерация параметров в JT-Trader
2. **Современные триггеры** - `registerTimeHandler()` и `addTaskByTime()`
3. **Автоматическое восстановление** - `canReStore: true` для перезапуска после сбоев
4. **Встроенная отчетность** - `StandardReportLayout` для мониторинга
5. **Упрощенная инициализация** - OrdersBasket без лишних параметров
6. **Лаконичный код** - минимум строк, максимум функциональности

## BaseScript - Базовый класс для торговых стратегий

`BaseScript` является фундаментальным классом, от которого наследуются все торговые стратегии. Он предоставляет:

### Основные свойства

- **`connectionName`** - имя подключения к бирже (обязательный параметр)
- **`symbols`** - массив торговых пар для работы стратегии
- **`interval`** - интервал для таймера в миллисекундах (если установлен, используется `onTimer` вместо `onTick`)
- **`hedgeMode`** - режим хеджирования позиций
- **`isInitialized`** - флаг инициализации скрипта
- **`balanceTotal`** и **`balanceFree`** - общий и свободный баланс аккаунта

### Инициализация глобальных сервисов

При создании экземпляра `BaseScript` автоматически инициализируются все глобальные сервисы:

```typescript
// Автоматически создаются при конструкторе BaseScript
globals.script = this;
globals.events = new EventEmitter();
globals.triggers = new TriggerService();
globals.report = new Report();
globals.storage = new Storage();
globals.candlesBufferService = new CandlesBufferService();
globals.indicators = new Indicators();

// OrdersBasket создается вручную для каждого символа
// import { OrdersBasket } from 'jt-lib';
```

## Жизненный цикл скрипта

### 1. Конструктор и инициализация

```typescript
constructor(args: GlobalARGS) {
  // Получение параметров из ARGS
  this.connectionName = getArgString('connectionName', undefined, true);
  this.hedgeMode = getArgBoolean('hedgeMode', false);
  
  // Определение символов для торговли
  if (isTester()) {
    this.symbols.push(args.symbol);
  } else {
    // Парсинг символов из строки параметров
    let symbolsLine = getArgString('symbols', '');
    // ... обработка символов
  }
}
```

### 2. Метод `onInit()` - Инициализация стратегии

Вызывается после создания экземпляра и получения баланса. Здесь происходит:

- Инициализация торговых компонентов
- Настройка индикаторов
- Создание начальных ордеров
- Подписка на события

```typescript
async onInit() {
  // Инициализация вашей стратегии
  console.log('Стратегия инициализирована');
  
  // Получение баланса
  console.log(`Общий баланс: ${this.balanceTotal} USDT`);
  console.log(`Свободный баланс: ${this.balanceFree} USDT`);
}
```

### 3. Метод `onTick()` - Обработка рыночных данных

Вызывается при каждом новом тике (изменении цены) **только для первого символа** в списке `symbols`. При работе с несколькими символами используйте `EventEmitter` для подписки на тики конкретных символов.

**Важно:** Метод `onTick()` не принимает параметры. Для получения рыночных данных используйте нативные функции.

```typescript
async onTick() {
  // Получение рыночных данных через нативные функции
  const currentPrice = close(); // Цена закрытия первого символа
  const askPrice = ask()[0];    // Цена покупки из стакана
  const bidPrice = bid()[0];    // Цена продажи из стакана
  const volume = volume();      // Объем торгов
  
  // Логика торговой стратегии
  console.log(`Новый тик: ${currentPrice}, объем: ${volume}`);
  console.log(`Ask: ${askPrice}, Bid: ${bidPrice}`);
}
```

### 4. Метод `onOrderChange(order: Order)` - Обработка изменений ордеров

Вызывается при изменении статуса любого ордера:

```typescript
async onOrderChange(order: Order) {
  console.log(`Ордер ${order.id} изменил статус: ${order.status}`);
  
  if (order.status === 'filled') {
    console.log(`Ордер исполнен: ${order.filled}/${order.amount}`);
  }
}
```

### 5. Метод `onStop()` - Завершение работы

Вызывается при остановке скрипта для очистки ресурсов:

```typescript
async onStop() {
  console.log('Стратегия остановлена');
  // Закрытие позиций, отмена ордеров и т.д.
}
```

## Обработка тиков - Получение рыночных данных

### Важное ограничение

**`onTick()` работает только с первым символом!**

При запуске скрипта на несколько символов (`symbols: ['BTC/USDT', 'ETH/USDT', 'ADA/USDT']`), метод `onTick()` будет вызываться **только для первого символа** (`BTC/USDT`).

### Работа с несколькими символами

Для получения тиков по всем символам используйте `EventEmitter`:

```typescript
async onInit() {
  // Подписка на тики для каждого символа
  for (const symbol of this.symbols) {
    globals.events.subscribeOnTick(() => this.onSymbolTick(symbol), this, symbol, 1000);
  }
}

async onSymbolTick(symbol: string) {
  // Обработка тика для конкретного символа
  const currentPrice = close(symbol); // Используем нативную функцию с символом
  console.log(`Тик для символа: ${symbol}, цена: ${currentPrice}`);
}
```

### Режимы работы

**Режим тиков** (по умолчанию):
- `onTick()` вызывается при каждом новом тике **первого символа**
- Для остальных символов используйте `EventEmitter`
- Используйте нативные функции `close()`, `ask()`, `bid()` для получения данных

**Режим таймера**:
- Если установлен `interval`, используется `onTimer()`
- `onTick()` не вызывается
- Полезно для стратегий, работающих по расписанию
- В `onTimer()` также используйте нативные функции для получения данных

```typescript
class Script extends BaseScript {
  interval = 60000; // 1 минута - переключение в режим таймера
  
  async onTimer() {
    // Вызывается каждую минуту
    const currentPrice = close(); // Используем нативную функцию
    const askPrice = ask()[0];
    const bidPrice = bid()[0];
    
    console.log(`Таймер сработал. Цена: ${currentPrice}, Ask: ${askPrice}, Bid: ${bidPrice}`);
  }
}
```

### Нативные функции для получения рыночных данных

Для получения рыночных данных используйте нативные функции:

```typescript
// Основные функции OHLC
const currentPrice = close();     // Цена закрытия (текущая цена)
const openPrice = open();         // Цена открытия
const highPrice = high();         // Максимальная цена
const lowPrice = low();           // Минимальная цена
const volume = volume();          // Объем торгов
const timestamp = tms();          // Временная метка

// Функции стакана заявок
const askData = ask();            // [цена, объем] - цена покупки
const bidData = bid();            // [цена, объем] - цена продажи
const askPrice = ask()[0];        // Только цена покупки
const bidPrice = bid()[0];        // Только цена продажи

// Для конкретного символа (при работе с несколькими символами)
const btcPrice = close('BTC/USDT');
const ethAsk = ask('ETH/USDT')[0];
```

## Параметры скрипта - Настройка стратегии

### Глобальная переменная ARGS

При запуске скрипта в JT-Trader создается глобальная переменная `ARGS`, которая содержит все параметры, переданные при запуске. Эта переменная доступна во всех частях кода через функции `getArg*()`.

### Тип GlobalARGS

```typescript
type GlobalARGS = {
  // Обязательные параметры
  connectionName: string;        // Название подключения к бирже
  symbols: string;              // "BTC/USDT,ETH/USDT" - список символов
  symbol: string;               // "BTC/USDT" - первый символ
  
  // Параметры тестера (только в режиме тестирования)
  start: string;                // "2021-01" - дата начала
  end: string;                  // "2021-12" - дата окончания
  startDate: Date;              // "2021-01-01T00:00:00.000Z"
  endDate: Date;                // "2021-12-31T23:59:59.999Z"
  timeframe: string;            // Таймфрейм для тестирования
  optimizerIteration: number;   // Номер итерации оптимизатора
  makerFee: number;             // Комиссия мейкера
  takerFee: number;             // Комиссия тейкера
  marketOrderSpread: number;    // Спред для рыночных ордеров
  balance: number;              // Начальный баланс
  leverage: number;             // Плечо
  
  // Пользовательские параметры
} & Record<string, string | number | boolean>;
```

### Режимы запуска

**1. Режим Runtime (торговля в реальном времени)**
- Доступны только обязательные параметры и пользовательские
- Параметры тестера отсутствуют
- Скрипт работает с реальными данными

**2. Режим Tester (тестирование на исторических данных)**
- Доступны все параметры, включая параметры тестера
- Скрипт работает с историческими данными
- Поддерживается оптимизация параметров

### Обязательные параметры

При создании скрипта в JT-Trader необходимо указать:

- **connectionName** - название подключения к бирже
- **symbols** - список торговых пар (через запятую)
- **interval** - таймфрейм для стратегии (опционально)

### Пользовательские параметры

Дополнительные параметры настраиваются через интерфейс JT-Trader и добавляются в `ARGS`:

```typescript
class Script extends BaseScript {
  private buyPrice: number;
  private sellPrice: number;
  private volume: number;
  private isTestMode: boolean;
  
  async onInit() {
    // Получение пользовательских параметров
    this.buyPrice = getArgNumber('buyPrice', 50000);
    this.sellPrice = getArgNumber('sellPrice', 55000);
    this.volume = getArgNumber('volume', 0.001);
    this.isTestMode = getArgBoolean('isTestMode', false);
    
    // Проверка режима работы
    if (getArgString('start')) {
      console.log('Запуск в режиме тестера');
      console.log(`Период: ${getArgString('start')} - ${getArgString('end')}`);
      console.log(`Баланс: ${getArgNumber('balance')} USDT`);
    } else {
      console.log('Запуск в режиме Runtime');
    }
    
    console.log(`Параметры стратегии:`);
    console.log(`Цена покупки: ${this.buyPrice}`);
    console.log(`Цена продажи: ${this.sellPrice}`);
    console.log(`Объем: ${this.volume}`);
    console.log(`Тестовый режим: ${this.isTestMode}`);
  }
}
```

## Примеры продвинутых стратегий

### 1. Стратегия для нескольких символов с OrdersBasket

**Преимущества использования OrdersBasket:**

- **Автоматическое управление контрактами** — правильная конвертация USD в контракты для каждого символа
- **Встроенные SL/TP** — автоматическое создание стоп-лосс и тейк-профит ордеров
- **Управление позициями** — получение информации о текущих позициях и их размерах
- **Reduce-only ордера** — безопасное закрытие позиций без открытия новых
- **Централизованное управление** — все ордера для символа управляются через один объект
- **Обработка ошибок** — встроенная валидация параметров и обработка ошибок биржи

**Важно:** OrdersBasket создается отдельно для каждого символа, так как каждый символ имеет свои параметры (размер контракта, минимальные объемы, комиссии).

```typescript
class Script extends BaseScript {
  private baskets: Record<string, OrdersBasket> = {};
  private positions: Record<string, number> = {};
  private buyPrices: Record<string, number> = {};
  private sellPrices: Record<string, number> = {};
  private usdAmount: number = 100; // Размер позиции в USD
  
  async onInit() {
    console.log('Мультисимвольная стратегия с OrdersBasket запущена');
    
    // Настройка цен для каждого символа
    this.buyPrices['BTC/USDT'] = 50000;
    this.sellPrices['BTC/USDT'] = 55000;
    this.buyPrices['ETH/USDT'] = 3000;
    this.sellPrices['ETH/USDT'] = 3300;
    
    // Создание OrdersBasket для каждого символа
    for (const symbol of this.symbols) {
      this.baskets[symbol] = new OrdersBasket({
        symbol: symbol,
        connectionName: this.connectionName,
        leverage: getArgNumber('leverage', 1),
        hedgeMode: this.hedgeMode
      });
      
      await this.baskets[symbol].init();
      this.positions[symbol] = 0;
      
      // Подписка на тики для каждого символа
      globals.events.subscribeOnTick(() => this.onSymbolTick(symbol), this, symbol, 1000);
      
      console.log(`OrdersBasket для ${symbol} инициализирован`);
    }
  }
  
  async onSymbolTick(symbol: string) {
    const basket = this.baskets[symbol];
    const currentPrice = close(symbol); // Используем нативную функцию с символом
    const buyPrice = this.buyPrices[symbol];
    const sellPrice = this.sellPrices[symbol];
    
    if (!basket || !buyPrice || !sellPrice) return;
    
    // Покупка при достижении целевой цены
    if (currentPrice <= buyPrice && this.positions[symbol] === 0) {
      // Конвертируем USD в контракты
      const contracts = basket.getContractsAmount(this.usdAmount, currentPrice);
      
      // Создаем market ордер с автоматическими SL/TP
      const slPrice = currentPrice * 0.95; // Stop Loss на 5% ниже
      const tpPrice = currentPrice * 1.05; // Take Profit на 5% выше
      
      const order = await basket.buyMarket(contracts, tpPrice, slPrice);
      this.positions[symbol] = 1;
      
      console.log(`${symbol}: Купили ${contracts} контрактов по цене: ${currentPrice}`);
      console.log(`SL: ${slPrice}, TP: ${tpPrice}, Ордер ID: ${order.id}`);
    }
    
    // Продажа при достижении целевой цены
    if (currentPrice >= sellPrice && this.positions[symbol] === 1) {
      // Получаем текущую позицию
      const position = await basket.getPosition();
      if (position && position.size > 0) {
        // Закрываем позицию через reduce-only ордер
        const closeOrder = await basket.createReduceOrder(
          'market',
          'long', // закрываем long позицию
          Math.abs(position.size), // размер позиции
          currentPrice
        );
        
        this.positions[symbol] = 0;
        console.log(`${symbol}: Закрыли позицию по цене: ${currentPrice}`);
        console.log(`Ордер закрытия ID: ${closeOrder.id}`);
      }
    }
  }
  
  async onStop() {
    // Закрываем все позиции при остановке
    for (const symbol of this.symbols) {
      const basket = this.baskets[symbol];
      if (basket) {
        await basket.cancelAllOrders();
        console.log(`Все ордера для ${symbol} отменены`);
      }
    }
  }
}
```

### 2. Стратегия с использованием таймера

```typescript
class Script extends BaseScript {
  interval = 300000; // 5 минут
  private basket: OrdersBasket;
  private lastAction: number = 0;
  private usdAmount: number = 100;
  
  async onInit() {
    console.log('Таймерная стратегия запущена');
    
    // Создание OrdersBasket для первого символа
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName,
      leverage: getArgNumber('leverage', 1),
      hedgeMode: this.hedgeMode
    });
    
    await this.basket.init();
  }
  
  async onTimer() {
    const now = Date.now();
    
    // Действие каждые 5 минут
    if (now - this.lastAction > 300000) {
      console.log('Выполняем действие по таймеру');
      
      // Получаем рыночные данные через нативные функции
      const currentPrice = close();
      const askPrice = ask()[0];
      const bidPrice = bid()[0];
      
      console.log(`Цена: ${currentPrice}, Ask: ${askPrice}, Bid: ${bidPrice}`);
      
      // Логика стратегии
      const balance = await getBalance();
      console.log(`Текущий баланс: ${balance.total.USDT} USDT`);
      
      // Пример торговли по таймеру
      const contracts = this.basket.getContractsAmount(this.usdAmount, currentPrice);
      console.log(`Можем купить ${contracts} контрактов на ${this.usdAmount} USD`);
      
      this.lastAction = now;
    }
  }
}
```

### 3. Стратегия с обработкой ордеров

```typescript
class Script extends BaseScript {
  private basket: OrdersBasket;
  private pendingOrders: string[] = [];
  private usdAmount: number = 100;
  
  async onInit() {
    console.log('Стратегия на основе ордеров запущена');
    
    // Создание OrdersBasket для первого символа
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName,
      leverage: getArgNumber('leverage', 1),
      hedgeMode: this.hedgeMode
    });
    
    await this.basket.init();
    
    // Создание начального ордера
    const currentPrice = close();
    const contracts = this.basket.getContractsAmount(this.usdAmount, currentPrice);
    const limitPrice = currentPrice * 0.9; // На 10% ниже текущей цены
    
    const order = await this.basket.buyLimit(contracts, limitPrice);
    this.pendingOrders.push(order.id);
    console.log(`Создан лимит ордер на покупку: ${contracts} контрактов по цене ${limitPrice}`);
  }
  
  async onOrderChange(order: Order) {
    console.log(`Ордер ${order.id}: ${order.status}`);
    
    if (order.status === 'filled') {
      // Ордер исполнен
      this.pendingOrders = this.pendingOrders.filter(id => id !== order.id);
      
      if (order.side === 'buy') {
        // После покупки создаем ордер на продажу
        const currentPrice = close();
        const contracts = this.basket.getContractsAmount(this.usdAmount, currentPrice);
        const sellPrice = order.price * 1.02; // На 2% выше цены покупки
        
        const sellOrder = await this.basket.sellLimit(contracts, sellPrice);
        this.pendingOrders.push(sellOrder.id);
        console.log(`Создан лимит ордер на продажу: ${contracts} контрактов по цене ${sellPrice}`);
      }
    }
    
    if (order.status === 'cancelled') {
      // Ордер отменен
      this.pendingOrders = this.pendingOrders.filter(id => id !== order.id);
      console.log(`Ордер ${order.id} отменен`);
    }
  }
}
```

## Дополнительные методы

### Обработка ошибок

```typescript
onError = async (e: any): Promise<never | void> => {
  console.error('Ошибка в стратегии:', e);
  // Кастомная обработка ошибок
  throw e;
};
```

### Обновление параметров

```typescript
async onArgsUpdate(args: GlobalARGS) {
  console.log('Параметры стратегии обновлены');
  // Обновление логики при изменении параметров
}
```

### Обработка событий биржи

```typescript
async onEvent(event: string, data: any) {
  console.log(`Событие биржи: ${event}`, data);
  // Обработка WebSocket событий
}
```

## Лучшие практики

1. **Используйте `onInit()` для инициализации** - не выполняйте тяжелые операции в конструкторе
2. **Используйте OrdersBasket для торговли** - не используйте прямые торговые методы, всегда работайте через OrdersBasket
3. **Используйте нативные функции для данных** - `close()`, `ask()`, `bid()` вместо параметров в `onTick()`
4. **Правильно конвертируйте объемы** - используйте `getContractsAmount()` для конвертации USD в контракты
5. **Обрабатывайте ошибки** - переопределите `onError()` для кастомной обработки
6. **Управляйте ресурсами** - используйте `onStop()` для очистки и отмены ордеров
7. **Проверяйте инициализацию** - используйте флаг `isInitialized`
8. **Логируйте действия** - используйте функции `log()`, `warning()`, `error()`

## Следующие шаги

- **[Система событий](/docs/jt-lib/events-system)** - Углубленное изучение EventEmitter
- **[Основы и ядро](/docs/jt-lib/core-fundamentals)** - Базовые компоненты системы
- **[Введение и архитектура](/docs/jt-lib/introduction-architecture)** - Обзор библиотеки
