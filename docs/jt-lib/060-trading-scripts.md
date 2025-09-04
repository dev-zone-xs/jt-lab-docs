---
id: trading-scripts
title: Торговые скрипты (Script)
sidebar_label: Торговые скрипты
---

# Торговые скрипты (Script)

Торговые скрипты являются основой для создания торговых стратегий в `jt-lib`. Они обеспечивают структурированный подход к разработке алгоритмических торговых систем с четким жизненным циклом и обработкой рыночных событий.

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

### 3. Метод `onTick(data: Tick)` - Обработка рыночных данных

Вызывается при каждом новом тике (изменении цены) **только для первого символа** в списке `symbols`. При работе с несколькими символами используйте `EventEmitter` для подписки на тики конкретных символов.

```typescript
async onTick(data: Tick) {
  // data содержит: open, high, low, close, volume, timestamp
  const currentPrice = data.close;
  const volume = data.volume;
  
  // Логика торговой стратегии
  console.log(`Новый тик: ${currentPrice}, объем: ${volume}`);
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
    globals.events.subscribeOnTick(this.onSymbolTick, this, symbol, 1000);
  }
}

async onSymbolTick(data: Tick) {
  // Обработка тика для конкретного символа
  console.log(`Тик для символа: ${data.symbol}, цена: ${data.close}`);
}
```

### Режимы работы

**Режим тиков** (по умолчанию):
- `onTick()` вызывается при каждом новом тике **первого символа**
- Для остальных символов используйте `EventEmitter`

**Режим таймера**:
- Если установлен `interval`, используется `onTimer()`
- `onTick()` не вызывается
- Полезно для стратегий, работающих по расписанию

```typescript
class MyStrategy extends BaseScript {
  interval = 60000; // 1 минута - переключение в режим таймера
  
  async onTimer() {
    // Вызывается каждую минуту
    console.log('Таймер сработал');
  }
}
```

### Данные тика (Tick)

Объект `Tick` содержит:

```typescript
interface Tick {
  open: number;      // Цена открытия
  high: number;      // Максимальная цена
  low: number;       // Минимальная цена
  close: number;     // Цена закрытия
  volume: number;    // Объем торгов
  timestamp: number; // Временная метка
}
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
class MyStrategy extends BaseScript {
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

## Примеры простых стратегий

### 1. Простая стратегия покупки и продажи (один символ)

```typescript
class SimpleBuySellStrategy extends BaseScript {
  private buyPrice: number;
  private sellPrice: number;
  private position: number = 0;
  
  async onInit() {
    console.log('Простая стратегия запущена');
    this.buyPrice = getArgNumber('buyPrice', 50000);
    this.sellPrice = getArgNumber('sellPrice', 55000);
  }
  
  async onTick(data: Tick) {
    // Работает только с первым символом!
    const currentPrice = data.close;
    
    // Покупка при достижении целевой цены
    if (currentPrice <= this.buyPrice && this.position === 0) {
      await this.buyMarket(0.001); // Покупка 0.001 BTC
      this.position = 1;
      console.log(`Купили по цене: ${currentPrice}`);
    }
    
    // Продажа при достижении целевой цены
    if (currentPrice >= this.sellPrice && this.position === 1) {
      await this.sellMarket(0.001); // Продажа 0.001 BTC
      this.position = 0;
      console.log(`Продали по цене: ${currentPrice}`);
    }
  }
}
```

### 1.1. Стратегия для нескольких символов

```typescript
class MultiSymbolStrategy extends BaseScript {
  private positions: Record<string, number> = {};
  private buyPrices: Record<string, number> = {};
  private sellPrices: Record<string, number> = {};
  
  async onInit() {
    console.log('Мультисимвольная стратегия запущена');
    
    // Настройка цен для каждого символа
    this.buyPrices['BTC/USDT'] = 50000;
    this.sellPrices['BTC/USDT'] = 55000;
    this.buyPrices['ETH/USDT'] = 3000;
    this.sellPrices['ETH/USDT'] = 3300;
    
    // Подписка на тики для каждого символа
    for (const symbol of this.symbols) {
      globals.events.subscribeOnTick(this.onSymbolTick, this, symbol, 1000);
      this.positions[symbol] = 0;
    }
  }
  
  async onSymbolTick(data: Tick) {
    const symbol = data.symbol;
    const currentPrice = data.close;
    const buyPrice = this.buyPrices[symbol];
    const sellPrice = this.sellPrices[symbol];
    
    if (!buyPrice || !sellPrice) return;
    
    // Покупка при достижении целевой цены
    if (currentPrice <= buyPrice && this.positions[symbol] === 0) {
      await this.buyMarket(0.001, symbol);
      this.positions[symbol] = 1;
      console.log(`${symbol}: Купили по цене: ${currentPrice}`);
    }
    
    // Продажа при достижении целевой цены
    if (currentPrice >= sellPrice && this.positions[symbol] === 1) {
      await this.sellMarket(0.001, symbol);
      this.positions[symbol] = 0;
      console.log(`${symbol}: Продали по цене: ${currentPrice}`);
    }
  }
}
```

### 2. Стратегия с использованием таймера

```typescript
class TimerStrategy extends BaseScript {
  interval = 300000; // 5 минут
  private lastAction: number = 0;
  
  async onInit() {
    console.log('Таймерная стратегия запущена');
  }
  
  async onTimer() {
    const now = Date.now();
    
    // Действие каждые 5 минут
    if (now - this.lastAction > 300000) {
      console.log('Выполняем действие по таймеру');
      
      // Логика стратегии
      const balance = await getBalance();
      console.log(`Текущий баланс: ${balance.total.USDT} USDT`);
      
      this.lastAction = now;
    }
  }
}
```

### 3. Стратегия с обработкой ордеров

```typescript
class OrderBasedStrategy extends BaseScript {
  private pendingOrders: string[] = [];
  
  async onInit() {
    console.log('Стратегия на основе ордеров запущена');
    
    // Создание начального ордера
    const order = await this.buyLimit(0.001, 45000);
    this.pendingOrders.push(order.id);
  }
  
  async onOrderChange(order: Order) {
    console.log(`Ордер ${order.id}: ${order.status}`);
    
    if (order.status === 'filled') {
      // Ордер исполнен
      this.pendingOrders = this.pendingOrders.filter(id => id !== order.id);
      
      if (order.side === 'buy') {
        // После покупки создаем ордер на продажу
        const sellOrder = await this.sellLimit(0.001, order.price * 1.02);
        this.pendingOrders.push(sellOrder.id);
      }
    }
    
    if (order.status === 'cancelled') {
      // Ордер отменен
      this.pendingOrders = this.pendingOrders.filter(id => id !== order.id);
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
2. **Обрабатывайте ошибки** - переопределите `onError()` для кастомной обработки
3. **Управляйте ресурсами** - используйте `onStop()` для очистки
4. **Проверяйте инициализацию** - используйте флаг `isInitialized`
5. **Логируйте действия** - используйте функции `log()`, `warning()`, `error()`

## Следующие шаги

- **[Система событий](/docs/jt-lib/events-system)** - Углубленное изучение EventEmitter
- **[Основы и ядро](/docs/jt-lib/core-fundamentals)** - Базовые компоненты системы
- **[Введение и архитектура](/docs/jt-lib/introduction-architecture)** - Обзор библиотеки
