---
id: triggers-system
title: Система триггеров (Triggers)
sidebar_label: Система триггеров
---

# Система триггеров (Triggers)

**TriggerService** управляет системой триггеров, которые автоматически выполняют действия при наступлении определенных условий. Триггеры интегрированы с системой хранения и могут восстанавливаться после перезапуска стратегии.

## ⚠️ Важно: Способы регистрации callback'ов

**Существует два способа передачи исполняемой функции в триггер:**

### 1. Прямая передача callback (стрелочная функция)
```typescript
// ✅ Правильно - стрелочная функция
trigger.addTask({
  name: 'myTask',
  triggerPrice: 50000,
  callback: async (args) => {
    console.log('Триггер сработал!', args);
  }
});
```

### 2. Регистрация callback по имени (обычная функция)
```typescript
// ✅ Правильно - регистрация обычной функции
class MyScript extends BaseScript {
  async onInit() {
    // Регистрируем функцию по имени
    this.triggerService.registerHandler('myTask', this.onPriceTrigger, this);
    
    // Добавляем задачу без callback
    trigger.addTask({
      name: 'myTask',
      triggerPrice: 50000,
      canReStore: true // ⚠️ ВАЖНО: только для зарегистрированных функций!
    });
  }
  
  // Обычная функция (не стрелочная!)
  async onPriceTrigger(args: any) {
    console.log('Триггер сработал!', args);
  }
}

// ❌ НЕПРАВИЛЬНО - стрелочные функции нельзя регистрировать
class MyScript extends BaseScript {
  async onInit() {
    // ❌ Ошибка! Стрелочные функции не поддерживаются для регистрации
    this.triggerService.registerHandler('myTask', (args) => {
      console.log('Это не сработает!');
    }, this);
  }
}
```

### 🔄 Восстановление триггеров при перезагрузке

**Ключевое различие:** Только зарегистрированные callback'ы могут быть восстановлены при перезагрузке скрипта!

- ✅ **Зарегистрированные функции** (`canReStore: true`) — восстанавливаются автоматически
- ❌ **Стрелочные функции** — НЕ восстанавливаются при перезагрузке

## Архитектура триггеров

- **Централизованное управление** - все триггеры управляются через `TriggerService`
- **Автоматическое хранение** - состояние триггеров сохраняется в Storage
- **Восстановление после перезапуска** - триггеры автоматически восстанавливают свое состояние
- **Интеграция с событиями** - триггеры подписываются на соответствующие события

## Типы триггеров

### Order Triggers - Триггеры по ордерам

**OrderTrigger** выполняет действия при изменении статуса ордеров.

**Основные возможности:**
- Реакция на изменение статуса ордера (открыт, исполнен, отменен)
- Поддержка как `orderId`, так и `clientOrderId`
- Автоматическое управление жизненным циклом задач
- Интеграция с системой хранения

**Примеры использования:**
```typescript
// Регистрация обработчика
globals.triggers.registerOrderHandler('createSlTp', this.createSlTp, this);

// Создание задачи
globals.triggers.addTaskByOrder({
  name: 'createSlTp',
  orderId: '12345',
  status: 'closed',
  canReStore: true
});
```

### Price Triggers - Триггеры по ценам

**PriceTrigger** выполняет действия при достижении определенных ценовых уровней.

**Основные возможности:**
- Поддержка направлений срабатывания (UpToDown, DownToUp)
- Автоматическое определение направления на основе текущей цены
- Оптимизация производительности через минимальные/максимальные цены
- Поддержка множественных символов

**Направления срабатывания:**
- **`UpToDown`** - срабатывает когда цена падает до указанного уровня
- **`DownToUp`** - срабатывает когда цена растет до указанного уровня

**Автоматический выбор направления:**
Если направление не указано, система автоматически определяет его на основе текущей цены:
- Если текущая цена **выше** триггерной → выбирается `UpToDown`
- Если текущая цена **ниже** триггерной → выбирается `DownToUp`

**Примеры использования:**

```typescript
import { PriceTriggerDirection } from 'jt-lib';

// 1. Автоматический выбор направления
globals.triggers.addTaskByPrice({
  symbol: 'BTC/USDT',
  name: 'autoDirection',
  triggerPrice: 50000, // Направление выберется автоматически
  canReStore: true
});

// 2. Явное указание направления - сработает при росте цены
globals.triggers.addTaskByPrice({
  symbol: 'BTC/USDT',
  name: 'sellOnRise',
  triggerPrice: 55000,
  direction: PriceTriggerDirection.DownToUp, // Сработает при росте
  canReStore: true
});

// 3. Явное указание направления - сработает при падении цены
globals.triggers.addTaskByPrice({
  symbol: 'BTC/USDT',
  name: 'buyOnFall',
  triggerPrice: 45000,
  direction: PriceTriggerDirection.UpToDown, // Сработает при падении
  canReStore: true
});

// Регистрация обработчиков
globals.triggers.registerPriceHandler('BTC/USDT', 'sellOnRise', this.onPriceRise, this);
globals.triggers.registerPriceHandler('BTC/USDT', 'buyOnFall', this.onPriceFall, this);
```

### Time Triggers - Триггеры по времени

**TimeTrigger** выполняет действия в определенное время или с заданным интервалом.

**Основные возможности:**
- Выполнение задач в конкретное время
- Повторяющиеся задачи с заданным интервалом
- Автоматическая валидация времени срабатывания
- Предупреждения о некорректных временных параметрах

**Примеры использования:**
```typescript
// Регистрация обработчика
globals.triggers.registerTimeHandler('dailyReport', this.generateDailyReport, this);

// Создание задачи на определенное время
globals.triggers.addTaskByTime({
  name: 'dailyReport',
  triggerTime: Date.now() + 24 * 60 * 60 * 1000, // завтра
  canReStore: true
});

// Повторяющаяся задача
globals.triggers.addTaskByTime({
  name: 'hourlyCheck',
  triggerTime: Date.now() + 60 * 60 * 1000, // через час
  interval: 60 * 60 * 1000, // повторять каждый час
  canReStore: true
});
```

## Система хранения триггеров

Все триггеры поддерживают автоматическое сохранение и восстановление:

- **`canReStore: true`** - триггер будет сохранен в Storage
- **Автоматическое восстановление** - при перезапуске стратегии триггеры восстанавливают свое состояние
- **Персистентность** - задачи продолжают работать после перезапуска

## Управление триггерами

### Регистрация обработчиков
```typescript
// Регистрация обработчиков для всех типов триггеров
globals.triggers.registerOrderHandler('taskName', this.handler, this);
globals.triggers.registerPriceHandler('BTC/USDT', 'taskName', this.handler, this);
globals.triggers.registerTimeHandler('taskName', this.handler, this);
```

### Создание задач
```typescript
// Создание задач для каждого типа триггера
const orderTaskId = globals.triggers.addTaskByOrder({...});
const priceTaskId = globals.triggers.addTaskByPrice({...});
const timeTaskId = globals.triggers.addTaskByTime({...});
```

### Отмена задач
```typescript
// Отмена конкретной задачи
globals.triggers.cancelOrderTask(orderTaskId);
globals.triggers.cancelPriceTask(priceTaskId);
globals.triggers.cancelTimeTask(timeTaskId);
```

## Практические примеры

### Автоматическое управление Stop Loss и Take Profit

```typescript
class AutoSlTpStrategy extends BaseScript {
  async onInit() {
    // Регистрируем обработчик для создания SL/TP
    globals.triggers.registerOrderHandler('createSlTp', this.createSlTp, this);
    
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName
    });
    await this.basket.init();
  }

  async onTick() {
    const price = this.basket.close();
    
    // Создаем ордер с автоматическим SL/TP
    const order = await this.basket.buyMarket(
      this.basket.getContractsAmount(100, price),
      0, // SL будет установлен автоматически
      0  // TP будет установлен автоматически
    );

    // Создаем задачу для автоматического создания SL/TP
    globals.triggers.addTaskByOrder({
      name: 'createSlTp',
      orderId: order.id,
      status: 'closed', // выполнится когда ордер исполнится
      canReStore: true
    });
  }

  async createSlTp(orderId: string) {
    // Получаем информацию об ордере
    const order = await this.basket.getOrder(orderId);
    
    if (order && order.status === 'closed') {
      const currentPrice = this.basket.close();
      const slPrice = currentPrice * 0.95; // SL на 5% ниже
      const tpPrice = currentPrice * 1.1;  // TP на 10% выше
      
      // Создаем SL и TP ордера
      await this.basket.createStopLossOrder('buy', order.amount, slPrice);
      await this.basket.createTakeProfitOrder('buy', order.amount, tpPrice);
    }
  }
}
```

### Ценовые триггеры для входа в позицию

```typescript
class PriceTriggerStrategy extends BaseScript {
  async onInit() {
    // Регистрируем обработчик для входа в позицию
    globals.triggers.registerPriceHandler('BTC/USDT', 'enterLong', this.enterLong, this);
    globals.triggers.registerPriceHandler('BTC/USDT', 'enterShort', this.enterShort, this);
    
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName
    });
    await this.basket.init();
    
    const currentPrice = this.basket.close();
    
    // Создаем триггеры для входа в позицию
    globals.triggers.addTaskByPrice({
      symbol: 'BTC/USDT',
      name: 'enterLong',
      triggerPrice: currentPrice * 0.98, // вход на 2% ниже текущей цены
      direction: 'DownToUp',
      canReStore: true
    });
    
    globals.triggers.addTaskByPrice({
      symbol: 'BTC/USDT',
      name: 'enterShort',
      triggerPrice: currentPrice * 1.02, // вход на 2% выше текущей цены
      direction: 'UpToDown',
      canReStore: true
    });
  }

  async enterLong() {
    const price = this.basket.close();
    const contracts = this.basket.getContractsAmount(100, price);
    
    await this.basket.buyMarket(contracts, price * 0.95, price * 1.1);
    console.log('Long position opened at', price);
  }

  async enterShort() {
    const price = this.basket.close();
    const contracts = this.basket.getContractsAmount(100, price);
    
    await this.basket.sellMarket(contracts, price * 1.05, price * 0.9);
    console.log('Short position opened at', price);
  }
}
```

### Временные триггеры для отчетов

```typescript
class ReportStrategy extends BaseScript {
  async onInit() {
    // Регистрируем обработчик для ежедневных отчетов
    globals.triggers.registerTimeHandler('dailyReport', this.generateDailyReport, this);
    globals.triggers.registerTimeHandler('hourlyCheck', this.hourlyCheck, this);
    
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName
    });
    await this.basket.init();
    
    // Создаем ежедневный отчет на 00:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    globals.triggers.addTaskByTime({
      name: 'dailyReport',
      triggerTime: tomorrow.getTime(),
      interval: 24 * 60 * 60 * 1000, // повторять каждый день
      canReStore: true
    });
    
    // Создаем проверку каждый час
    globals.triggers.addTaskByTime({
      name: 'hourlyCheck',
      triggerTime: Date.now() + 60 * 60 * 1000, // через час
      interval: 60 * 60 * 1000, // повторять каждый час
      canReStore: true
    });
  }

  async generateDailyReport() {
    const positions = await this.basket.getPositions();
    const orders = await this.basket.getOrders();
    
    console.log('=== Daily Report ===');
    console.log('Positions:', positions.length);
    console.log('Orders:', orders.length);
    console.log('Current P&L:', positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0));
  }

  async hourlyCheck() {
    const price = this.basket.close();
    console.log(`Hourly check - Current price: ${price}`);
    
    // Проверяем условия для торговли
    if (price > 50000) {
      console.log('Price above 50k - consider taking profit');
    }
  }
}
```

## Интеграция с другими компонентами

### TriggerService + EventEmitter
- TriggerService подписывается на события через EventEmitter
- Автоматическая синхронизация жизненных циклов
- Полная типизация всех обработчиков

### Storage + Triggers
- Триггеры автоматически сохраняют свое состояние
- При перезапуске стратегии состояние восстанавливается
- Обеспечивается непрерывность работы автоматизации

### BaseScript + Triggers
- Стратегия регистрирует обработчики триггеров
- Автоматическое управление подписками при уничтожении
- Интеграция с системой событий для автоматизации

## Следующие шаги

- **[Система событий](/docs/jt-lib/events-system)** - EventEmitter для управления событиями
- **[Торговые скрипты](/docs/jt-lib/trading-scripts)** - Базовый класс для торговых скриптов
- **[Работа с биржей](/docs/jt-lib/exchange-orders-basket)** - OrdersBasket для торговых операций
