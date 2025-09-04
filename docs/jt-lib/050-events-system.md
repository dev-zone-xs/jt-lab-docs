---
id: events-system
title: Система событий (Events)
sidebar_label: Система событий
---

# Система событий (Events)

Система событий JT-LIB обеспечивает реактивное программирование и автоматизацию торговых стратегий. Она состоит из EventEmitter для управления событиями и системы триггеров для автоматического выполнения действий по условиям.

## EventEmitter - Как работает система событий

**EventEmitter** является центральным компонентом системы событий, наследующим от `BaseObject`. Он управляет подписками на события, их выполнением и автоматической очисткой ресурсов.


### Основные возможности

- **Подписка на события** - регистрация обработчиков для различных типов событий
- **Автоматическое управление жизненным циклом** - отписка при уничтожении объектов
- **Специализированные события** - `onTick`, `onOrderChange` с поддержкой символов
- **Валидация обработчиков** - проверка корректности функций и владельцев
- **Управление интервалами** - настройка частоты выполнения тиков

### Ключевые методы

#### subscribe()
Основной метод для подписки на события. Обеспечивает безопасную регистрацию обработчиков с полной типизацией.

**Новые возможности типизации:**
- **Generic типизация** - `subscribe<T extends EventName>(eventName: T, handler: TypedEventHandler<T>, owner: BaseObject)`
- **Автоматический вывод типов** - TypeScript автоматически определяет тип данных для обработчика
- **Проверка типов на этапе компиляции** - предотвращение ошибок с неправильными типами данных

**Важные ограничения:**
- Не поддерживает анонимные стрелочные функции (должна быть именованная функция)
- Обработчик должен быть методом класса, наследующего от `BaseObject`
- Владелец должен быть экземпляром `BaseObject`

#### subscribeOnTick()
Специализированный метод для подписки на тики с настраиваемым интервалом.

```typescript
// Подписка на тики с интервалом 30 секунд
globals.events.subscribeOnTick(this.onTick, this, 'BTC/USDT', 30*1000);

// Подписка с интервалом по умолчанию (1000ms)
globals.events.subscribeOnTick(this.onTick, this, 'BTC/USDT');
```

#### subscribeOnOrderChange()
Подписка на изменения ордеров для конкретного символа.

```typescript
// Подписка на изменения ордеров BTC/USDT
globals.events.subscribeOnOrderChange(this.onOrderChange, this, 'BTC/USDT');
```

#### emit()
Генерация событий с полной типизацией данных.

**Новые возможности:**
- **Generic типизация** - `emit<T extends EventName>(eventName: T, data?: GetEventData<T>)`
- **Автоматическая проверка типов** - TypeScript проверяет соответствие данных типу события
- **IntelliSense поддержка** - автодополнение для типов данных

```typescript
// Типизированная генерация событий
const order: Order = { /* данные ордера */ };
await globals.events.emit('onPnlChange', {
  type: 'pnl',
  amount: 100.50,
  symbol: 'BTC/USDT',
  order: order
});

// TypeScript автоматически проверит соответствие типов
```

### Система управления событиями

EventEmitter автоматически управляет жизненным циклом событий:
- При уничтожении объекта автоматически отписывает его от всех событий
- Предотвращает утечки памяти через некорректные подписки
- Обеспечивает корректную очистку ресурсов

## Подписка на события - Как слушать изменения в системе

### Типы событий

#### Системные события с полной типизацией
- **`onTick`** - выполняется с заданным интервалом (тип: `TickEventData`)
- **`onOrderChange`** - изменения в статусе ордеров (тип: `OrderChangeEventData`)
- **`onPnlChange`** - изменения в прибыли/убытках (тип: `PnlChangeEventData`)
- **`onArgsUpdate`** - обновление аргументов стратегии (тип: `ArgsUpdateEventData`)
- **`onTimer`** - события таймера (тип: `TimerEventData`)
- **`onTickEnded`** - завершение тика (тип: `TickEndedEventData`)
- **`onRun`** - запуск стратегии (тип: `RunEventData`)
- **`onStop`** - остановка стратегии (тип: `StopEventData`)
- **`onReportAction`** - действия с отчетами (тип: `ReportActionEventData`)

#### Динамические события по символам
- **`onTick_${symbol}`** - тики для конкретного символа
- **`onOrderChange_${symbol}`** - изменения ордеров для конкретного символа

#### Пользовательские события
- **`emit()`** - генерация пользовательских событий (тип: `CustomEventData`)
- **`subscribe()`** - подписка на пользовательские события

### Примеры подписки с типизацией

```typescript
// Подписка на тики с интервалом 5 секунд (автоматическая типизация TickEventData)
globals.events.subscribeOnTick(this.processTick, this, 'BTC/USDT', 5000);

// Подписка на изменения ордеров (автоматическая типизация OrderChangeEventData)
globals.events.subscribeOnOrderChange(this.handleOrderChange, this, 'BTC/USDT');

// Подписка на PnL изменения (автоматическая типизация PnlChangeEventData)
globals.events.subscribe('onPnlChange', this.onPnlChange, this);

// Пользовательское событие
globals.events.subscribe('strategyStarted', this.onStrategyStart, this);

// Генерация события с типизированными данными
const order: Order = { /* данные ордера */ };
const pnlData: PnlChangeEventData = {
  type: 'pnl',
  amount: 100.50,
  symbol: 'BTC/USDT',
  order: order
};
globals.events.emit('onPnlChange', pnlData);
```

### Типизированные обработчики событий

```typescript
class MyStrategy extends BaseScript {
  // Обработчик тиков с полной типизацией
  async onTick(data: TickEventData) {
    console.log(`Price: ${data.close}, Volume: ${data.volume}`);
    console.log(`Bid: ${data.bid}, Ask: ${data.ask}`);
  }

  // Обработчик изменений ордеров с типизацией
  async onOrderChange(order: OrderChangeEventData) {
    console.log(`Order ${order.id} status: ${order.status}`);
    if (order.status === 'closed') {
      console.log(`Filled: ${order.filled}/${order.amount}`);
    }
  }

  // Обработчик PnL изменений с типизацией
  async onPnlChange(data: PnlChangeEventData) {
    console.log(`PnL ${data.type}: ${data.amount} for ${data.symbol}`);
    console.log(`Related order: ${data.order.id}`); // data.order имеет тип Order
  }
}
```



## Новые возможности типизации (types-for-all2)

### Полная типизация событий
В ветке `types-for-all2` добавлена полная типизация для всех событий, что обеспечивает:

- **Type Safety** - проверка типов на этапе компиляции
- **IntelliSense** - автодополнение и подсказки в IDE
- **Рефакторинг** - безопасное переименование и изменение кода
- **Документация** - типы служат документацией API

### Основные типы данных событий

#### TickEventData
```typescript
interface TickEventData {
  symbol: string;
  timestamp: number;
  datetime: string;
  high: number;
  low: number;
  bid: number;
  ask: number;
  open: number;
  close: number;
  volume: number;
  // ... и другие поля
}
```

#### OrderChangeEventData
```typescript
type OrderChangeEventData = Order; // Использует глобальный тип Order
```

#### PnlChangeEventData
```typescript
interface PnlChangeEventData {
  type: 'pnl' | 'fee' | 'transfer';
  amount: number;
  symbol: string;
  order: Order; // Использует глобальный тип Order
}
```

### Union типы для событий
```typescript
type EventName = 
  | 'onOrderChange'
  | 'onTick'
  | 'onPnlChange'
  | 'onTimer'
  | 'onTickEnded'
  | 'onArgsUpdate'
  | 'onEvent'
  | 'onRun'
  | 'onBeforeStop'
  | 'onStop'
  | 'onAfterStop'
  | 'onReportAction'
  | 'onBeforeTick' // Deprecated
  | 'onAfterTick' // Deprecated
  | `onTick_${string}` // Динамические события по символам
  | `onOrderChange_${string}`;
```

### Продвинутая типизация с Conditional Types

```typescript
// Conditional type для получения типа данных события
type GetEventData<T extends EventName> = T extends 'onOrderChange'
  ? Order
  : T extends `onOrderChange_${string}`
  ? Order
  : T extends 'onTick'
  ? undefined
  : T extends 'onPnlChange'
  ? PnlChangeEventData
  : T extends 'onArgsUpdate'
  ? ArgsUpdateEventData
  : T extends 'onReportAction'
  ? ReportActionEventData
  : undefined;

// Типизированный обработчик событий
type TypedEventHandler<T extends EventName> = (data?: GetEventData<T>) => Promise<any>;

// Типизированные функции subscribe и emit
type TypedSubscribe = <T extends EventName>(
  eventName: T,
  handler: TypedEventHandler<T>,
  owner: BaseObject,
) => string;

type TypedEmit = <T extends EventName>(
  eventName: T,
  data?: GetEventData<T>,
  listeners?: EventListener[],
) => Promise<void>;
```

## Интеграция с другими компонентами

### EventEmitter + TriggerService
- EventEmitter генерирует события с полной типизацией
- TriggerService подписывается на события и выполняет задачи
- Автоматическая синхронизация жизненных циклов

### BaseScript + Events
- Стратегия подписывается на события через EventEmitter
- Автоматическое управление подписками при уничтожении
- Полная типизация всех обработчиков событий

### OrdersBasket + Events
- OrdersBasket автоматически генерирует события при изменении ордеров
- События `onOrderChange` и `onPnlChange` для отслеживания торговли
- Интеграция с системой событий для реактивного программирования

## Следующие шаги

- **[Система триггеров](/docs/jt-lib/triggers-system)** - Автоматические действия по условиям
- **[Торговые скрипты](/docs/jt-lib/trading-scripts)** - Базовый класс для торговых скриптов
- **[Работа с биржей](/docs/jt-lib/exchange-orders-basket)** - OrdersBasket для торговых операций
