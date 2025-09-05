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

### Примеры подписки на события

```typescript
// Подписка на изменения ордеров для конкретного символа
globals.events.subscribeOnOrderChange(this.handleOrderChange, this, 'BTC/USDT');

// Подписка на тики для конкретного символа с интервалом 5 секунд
globals.events.subscribeOnTick(this.processTick, this, 'BTC/USDT', 5000);

// Подписка на системные события
globals.events.subscribe('onPnlChange', this.onPnlChange, this);
globals.events.subscribe('onArgsUpdate', this.onArgsUpdate, this);
globals.events.subscribe('onReportAction', this.onReportAction, this);

// Подписка на события в тестере
globals.events.subscribe('onAfterStop', this.onStopTester, this);

// Подписка на события в рантайме
globals.events.subscribe('onOrderChange', this.collectOrdersRuntime, this);
```

### Примеры обработчиков событий

```typescript
class MyService extends BaseObject {
  constructor() {
    super();
    // Подписка на события в конструкторе
    globals.events.subscribe('onOrderChange', this.onOrderChange, this);
    globals.events.subscribe('onTick', this.onTick, this);
  }

  // Обработчик изменений ордеров
  async onOrderChange(order: Order) {
    log('OrderHandler', 'Order status changed', { orderId: order.id, status: order.status }, true);
    if (order.status === 'closed') {
      log('OrderHandler', 'Order filled', { orderId: order.id, filled: order.filled, amount: order.amount }, true);
    }
  }

  // Обработчик тиков
  async onTick(data: Tick) {
    trace('TickHandler', 'Price tick', { price: data.close, volume: data.volume }, true);
  }

  // Обработчик PnL изменений
  async onPnlChange(data: PnlChangeEventData) {
    log('PnLHandler', 'PnL changed', { type: data.type, amount: data.amount, symbol: data.symbol }, true);
  }
}
```



## Интеграция с другими компонентами

Система событий в JT-LIB интегрирована с основными компонентами библиотеки. EventEmitter создается в конструкторе BaseScript и далее используется во всей системе. Основными поставщиками событий являются BaseScript и OrdersBasket.

### Поставщики событий

#### BaseScript - основной поставщик событий

**BaseScript** генерирует следующие события:
- **`onTick`** - при каждом тике рыночных данных (через emitOnTick)
- **`onTickEnded`** - завершение тика
- **`onTimer`** - события таймера
- **`onOrderChange`** - при изменении состояния ордера
- **`onArgsUpdate`** - при обновлении аргументов стратегии
- **`onEvent`** - события из веб-сокетов от бирж
- **`onRun`** - запуск стратегии
- **`onBeforeStop`** - перед остановкой стратегии
- **`onStop`** - при остановке стратегии
- **`onAfterStop`** - после остановки стратегии
- **`onReportAction`** - действия с отчетами

#### OrdersBasket - поставщик торговых событий

**OrdersBasket** генерирует следующие события:
- **`onPnlChange`** - при изменении прибыли/убытка (реализованной и нереализованной)


### Подписки на события

#### TriggerService
При создании в конструкторе подписывается на события:
- **`onTick`** - для выполнения задач по времени
- **`onOrderChange`** - для выполнения задач по состоянию ордеров

#### OrdersBasket
При создании в конструкторе подписывается на события:
- **`onOrderChange_${symbol}`** - для конкретного символа
- **`onTick_${symbol}`** - для конкретного символа

#### StandardReportLayout
При создании в конструкторе подписывается на события:
- **`onArgsUpdate`** - для обработки обновлений аргументов
- **`onAfterStop`** - для обработки остановки в тестере
- **`onOrderChange`** - для записи изменений ордеров в рантайме
- **`onReportAction`** - для обработки действий с отчетами

#### ReportStatistics
При создании в конструкторе подписывается на события:
- **`onOrderChange`** - для сбора статистики по ордерам
- **`onTick`** - для сбора данных

#### ReportActionButton
При создании в конструкторе подписывается на события:
- **`onReportAction`** - для обработки действий кнопок

**Важно:** BaseScript и все примеры скриптов НЕ подписываются на события напрямую. Они только переопределяют методы обработки событий (`onTick`, `onOrderChange`, `onInit`, `onStop`, `onEvent`), которые вызываются автоматически системой.

### Автоматическое управление жизненными циклами

Система событий JT-LIB обеспечивает автоматическое управление подписками для предотвращения утечек памяти и некорректных вызовов обработчиков.

**Критическая проблема безопасности:**
В JavaScript при уничтожении объекта его методы (callback-функции) остаются в памяти, если на них есть ссылки в EventEmitter. Это приводит к двум серьезным проблемам:

1. **Утечки памяти** - объекты не освобождаются из памяти
2. **Критическая угроза безопасности** - callback-функции могут вызываться после уничтожения объекта, что особенно опасно в торговых системах, где это может привести к неожиданным торговым операциям

**Особенно критично в торговых стратегиях:**
- Пользователь может уничтожить объект, но callback-функции продолжат работать
- Стратегия продолжает работать даже после уничтожения объекта-владельца callback-функций
- Это может привести к непредсказуемым потерям средств
- Поэтому критически важно проверять, уничтожен ли объект при вызове callback-функций

**Решение через параметр `owner`:**
При подписке на события передается параметр `owner` (обычно `this`), который позволяет системе отслеживать состояние объекта-владельца обработчика.

**BaseObject обеспечивает:**
- Автоматическую отписку от всех событий при вызове `destroy()`
- Установку флага `_isDestroyed = true` при уничтожении
- Рекурсивное уничтожение дочерних объектов
- Вызов `unsubscribe()` для очистки всех подписок

**EventEmitter обеспечивает:**
- **Проверку флага `_isDestroyed` перед вызовом обработчиков:**
  ```typescript
  if (listener.owner?._isDestroyed === true) {
    error('EventEmitter::emit()', 'The owner of the listener is destroyed', {
      ...listener,
      owner: undefined,
      data,
    });
    // НЕ вызываем listener.handler(data) - предотвращаем торговые операции!
  } else {
    let result = await listener.handler(data); // Безопасный вызов
  }
  ```
- Автоматическое удаление подписок через `unsubscribeByObjectId()`
- Логирование попыток вызова методов уничтоженных объектов
- **Критически важно:** предотвращение выполнения торговых операций уничтоженными объектами
- Обработку ошибок в обработчиках событий

**Пример автоматической очистки:**
```typescript
class TradingService extends BaseObject {
  constructor() {
    super();
    // Подписка с передачей this как owner
    globals.events.subscribe('onTick', this.onTick, this);
  }
  
  async onTick(data: Tick) {
    // ОПАСНО: без проверки _isDestroyed этот метод может
    // выполняться даже после уничтожения объекта!
    await this.createOrder('buy', 100); // Торговая операция!
  }
  
  // При вызове destroy() автоматически:
  // 1. Устанавливается _isDestroyed = true
  // 2. Вызывается unsubscribe()
  // 3. EventEmitter удаляет все подписки этого объекта
  // 4. onTick больше НЕ будет вызываться - торговые операции остановлены
}
```

**Без системы управления жизненными циклами:**
```typescript
// ОПАСНЫЙ КОД - НЕ ИСПОЛЬЗУЙТЕ!
class DangerousService {
  constructor() {
    // Подписка БЕЗ owner - объект не отслеживается!
    globals.events.subscribe('onTick', this.onTick, null);
  }
  
  async onTick(data: Tick) {
    // Этот метод будет вызываться даже после уничтожения объекта!
    await this.createOrder('buy', 100); // КРИТИЧЕСКАЯ ОШИБКА!
  }
}
```

Такая архитектура обеспечивает надежное управление памятью и предотвращает утечки при работе с событиями в торговых стратегиях.


