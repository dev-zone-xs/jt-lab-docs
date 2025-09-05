---
id: error-handling
title: Обработка ошибок (Error Handling)
sidebar_label: Обработка ошибок
---

# Обработка ошибок (Error Handling)

Система обработки ошибок в JT-LIB построена вокруг класса **BaseError** - расширенного класса ошибок, который предоставляет детальную информацию о контексте возникновения ошибки и автоматически интегрируется с системой логирования.

## BaseError - Расширенная система обработки ошибок

**BaseError** является расширенным классом ошибок, который предоставляет детальную информацию о контексте возникновения ошибки и автоматически интегрируется с системой логирования.

### Основные возможности

- **Уникальная идентификация** - каждая ошибка получает уникальный ID
- **Множественный контекст** - возможность добавления нескольких контекстов к одной ошибке
- **Автоматический стек вызовов** - сохранение полного стека вызовов
- **Интеграция с логированием** - автоматическая запись в систему логов
- **Отладочная информация** - детальное логирование в debug режиме

### Ключевые свойства

- **`id: string`** - уникальный идентификатор ошибки (2 символа)
- **`allContext: any[]`** - массив всех контекстов, добавленных к ошибке
- **`internalStack: string[]`** - внутренний стек вызовов
- **`message: string`** - сообщение об ошибке (наследуется от Error)
- **`stack: string`** - стек вызовов (наследуется от Error)

### Конструкторы

**BaseError** поддерживает два способа создания:

```typescript
// Создание из строки сообщения
const error1 = new BaseError('Ошибка подключения к бирже', { 
  exchange: 'Binance', 
  timeout: 5000 
});

// Создание из существующей ошибки
const originalError = new Error('Network timeout');
const error2 = new BaseError(originalError, { 
  url: 'https://api.binance.com',
  retryCount: 3 
});

// Создание из BaseError (копирование)
const error3 = new BaseError(existingBaseError, additionalContext);
```

### Методы

#### addContext(line: string, context?: any)
Добавляет дополнительный контекст к ошибке. Полезно для накопления информации о состоянии системы в момент ошибки.

```typescript
const error = new BaseError('Ошибка обработки ордера', { orderId: '12345' });

// Добавление дополнительного контекста
error.addContext('OrderManager::processOrder', { 
  symbol: 'BTC/USDT', 
  amount: 0.001 
});

error.addContext('ExchangeAPI::placeOrder', { 
  response: 'timeout', 
  latency: 5000 
});
```

### Автоматическая интеграция с системой

**BaseError** автоматически интегрируется с системой логирования:

```typescript
// В BaseObject.error()
error('OrderManager', 'Ошибка создания ордера', { 
  symbol: 'BTC/USDT',
  amount: 0.001 
});

// Автоматически создается BaseError и записывается в логи
// В логах появится:
// {
//   date: "2024-01-15 10:30:45",
//   event: "OrderManager",
//   msg: "🚫 Ошибка создания ордера",
//   context: {
//     stack: [...],
//     allContext: [...],
//     internalStack: [...]
//   }
// }
```

### Отладочная информация

В debug режиме (`ARGS.isDebug = true`) BaseError автоматически сохраняет дополнительную информацию:

```typescript
// В globals.userData.glAllContext сохраняется:
[
  {
    time: "2024-01-15 10:30:45",
    line: "OrderManager::createOrder (line 123)",
    context: { orderId: "12345", symbol: "BTC/USDT" }
  },
  {
    time: "2024-01-15 10:30:46", 
    line: "ExchangeAPI::placeOrder (line 456)",
    context: { response: "timeout", latency: 5000 }
  }
]
```

## Интеграция с BaseObject

**BaseObject** автоматически использует BaseError для обработки ошибок:

```typescript
class MyStrategy extends BaseObject {
  async processOrder(order: Order) {
    try {
      // Логика обработки ордера
    } catch (e) {
      // Автоматическое создание BaseError с контекстом объекта
      this.error(e, { 
        orderId: order.id,
        symbol: order.symbol 
      });
    }
  }
  
  checkBalance() {
    if (this.balance < 100) {
      // Создание ошибки с автоматическим контекстом объекта
      this.error('Недостаточно средств', {
        balance: this.balance,
        required: 100,
        objectId: this.id
      });
    }
  }
}
```

**Автоматические возможности BaseObject.error():**
- Создание BaseError с уникальным ID
- Автоматическое добавление ID объекта в контекст
- Формирование события в формате `ClassName::methodName symbol`
- Интеграция с системой логирования
- Вызов `onError()` для дополнительной обработки

## Практические примеры использования

### В торговых стратегиях

```typescript
try {
  await exchange.placeOrder(order);
} catch (e) {
  // Автоматическое создание BaseError с контекстом
  error(e, { 
    orderId: order.id,
    symbol: order.symbol,
    price: order.price,
    amount: order.amount
  });
}

// Или создание собственной ошибки
if (balance < requiredAmount) {
  const error = new BaseError('Недостаточно средств', {
    balance: balance,
    required: requiredAmount,
    symbol: symbol
  });
  
  error.addContext('Strategy::checkBalance', { 
    strategyId: this.id,
    timestamp: Date.now() 
  });
  
  throw error;
}
```

### В системе индикаторов

```typescript
try {
  const rsi = calculateRSI(prices);
} catch (e) {
  const error = new BaseError(e, {
    indicator: 'RSI',
    period: 14,
    pricesLength: prices.length
  });
  
  error.addContext('IndicatorService::calculateRSI', {
    lastPrice: prices[prices.length - 1],
    timeframe: '1h'
  });
  
  throw error;
}
```

### В системе управления ордерами

```typescript
class OrderManager extends BaseObject {
  async createOrder(orderData: OrderData) {
    try {
      // Валидация данных
      this.validateOrderData(orderData);
      
      // Создание ордера
      const order = await this.exchange.placeOrder(orderData);
      
      return order;
    } catch (e) {
      // Создание BaseError с полным контекстом
      const error = new BaseError(e, {
        orderData: orderData,
        exchange: this.exchange.name,
        timestamp: Date.now()
      });
      
      error.addContext('OrderManager::createOrder', {
        managerId: this.id,
        balance: this.balance
      });
      
      // Логирование и проброс ошибки
      this.error(error);
      throw error;
    }
  }
}
```

## Сравнение с обычными Error

| Возможность | Error | BaseError |
|-------------|-------|-----------|
| Уникальный ID | ❌ | ✅ |
| Множественный контекст | ❌ | ✅ |
| Автоматическое логирование | ❌ | ✅ |
| Интеграция с BaseObject | ❌ | ✅ |
| Отладочная информация | ❌ | ✅ |
| Стек вызовов | ✅ | ✅ |
| Сообщение об ошибке | ✅ | ✅ |

## Преимущества BaseError

1. **Детальная диагностика** - полная информация о состоянии системы
2. **Автоматическое логирование** - интеграция с системой логов
3. **Уникальная идентификация** - легко найти конкретную ошибку
4. **Накопление контекста** - возможность добавления информации на разных уровнях
5. **Отладочная поддержка** - дополнительная информация в debug режиме

## Лучшие практики

### 1. Всегда добавляйте контекст
```typescript
// ❌ Плохо
throw new Error('Ошибка подключения');

// ✅ Хорошо
const error = new BaseError('Ошибка подключения', {
  exchange: 'Binance',
  endpoint: '/api/v3/account',
  timeout: 5000,
  retryCount: 3
});
```

### 2. Используйте addContext для накопления информации
```typescript
const error = new BaseError('Ошибка обработки ордера', { orderId: '12345' });

// Добавляем контекст с разных уровней
error.addContext('Strategy::processSignal', { signal: 'BUY', confidence: 0.85 });
error.addContext('OrderManager::validateOrder', { balance: 1000, required: 100 });
error.addContext('ExchangeAPI::placeOrder', { response: 'timeout', latency: 5000 });
```

### 3. Используйте BaseObject.error() для автоматической обработки
```typescript
class MyStrategy extends BaseObject {
  async executeTrade() {
    try {
      // Торговая логика
    } catch (e) {
      // Автоматически создаст BaseError с контекстом объекта
      this.error(e, { 
        tradeId: this.currentTrade?.id,
        symbol: this.symbol 
      });
    }
  }
}
```

### 4. Обрабатывайте ошибки на разных уровнях
```typescript
// На уровне стратегии
try {
  await this.processMarketData(data);
} catch (e) {
  this.error(e, { 
    dataType: 'tick',
    symbol: data.symbol,
    price: data.price 
  });
}

// На уровне компонента
try {
  await this.calculateIndicator(prices);
} catch (e) {
  const error = new BaseError(e, {
    indicator: 'RSI',
    period: 14,
    pricesCount: prices.length
  });
  
  error.addContext('IndicatorService::calculate', {
    lastPrice: prices[prices.length - 1],
    timeframe: '1h'
  });
  
  throw error;
}
```

BaseError делает отладку торговых стратегий значительно проще, предоставляя всю необходимую информацию для быстрого выявления и исправления проблем.
