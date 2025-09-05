# JT-LIB

[![License](https://img.shields.io/badge/license-AGPLv3-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)

TypeScript библиотека для создания торговых роботов на платформе JT-Trader. Предоставляет упрощенный интерфейс для взаимодействия с биржами и реализации торговых стратегий.

## Возможности

- **Торговые операции** - покупка, продажа, размещение ордеров
- **Рыночные данные** - получение цен, объемов, стакана заявок
- **Система событий** - реакция на изменения рынка в реальном времени
- **Хранение данных** - сохранение состояния и истории операций
- **Триггеры** - автоматическое выполнение действий по условиям
- **Отчетность** - детальная аналитика торговых операций
- **Технические индикаторы** - встроенные индикаторы для анализа
- **Управление свечами** - буферизация и обработка свечных данных

## Установка

```bash
# JT-LIB устанавливается вместе с JT-Trader
git clone https://github.com/your-org/jt-trader.git
cd jt-trader
npm install
```

## Быстрый старт

### Ваш первый торговый скрипт - DCA стратегия

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

  async onInit() {
    // Создаем корзину для торговли
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
  }

  // Функция покупки
  buyDCA = async () => {
    const amount = this.dcaBasket.getContractsAmount(this.sizeUsd);
    await this.dcaBasket.buyMarket(amount);
    log('DCA покупка выполнена', `amount: ${amount}, price: ${this.dcaBasket.close()}`);
  };
}
```

## Основные компоненты

### BaseScript - Базовый класс для торговых стратегий

```typescript
class Script extends BaseScript {
  async onInit() {
    // Инициализация стратегии
  }

  async onTick() {
    // Обработка каждого тика
  }

  async onOrderChange(order: Order) {
    // Обработка изменений ордеров
  }

  async onStop() {
    // Очистка ресурсов при остановке
  }
}
```

### OrdersBasket - Управление торговыми операциями

```typescript
// Создание корзины для торговли
const basket = new OrdersBasket({
  symbol: 'BTC/USDT',
  connectionName: 'Binance',
  leverage: 1,
  hedgeMode: false
});

await basket.init();

// Торговые операции
const amount = basket.getContractsAmount(100); // 100 USD в контракты
await basket.buyMarket(amount); // Рыночная покупка
await basket.sellLimit(amount, 50000); // Лимитная продажа
```

### Технические индикаторы

```typescript
// Создание индикаторов
const rsi = await globals.indicators.rsi('BTC/USDT', '1h', 14);
const sma = await globals.indicators.sma('BTC/USDT', '1h', 20);

// Получение значений
const currentRsi = rsi.getValue();
const currentSma = sma.getValue();

// Использование в стратегии
if (currentRsi < 30 && currentPrice > currentSma) {
  // Сигнал на покупку
}
```

## Система отчетности

```typescript
// Создание стандартного отчета
const reportLayout = new StandardReportLayout();

// Отправка данных в отчет
updateReport('chart', {
  type: 'line',
  data: priceData,
  title: 'Цена BTC/USDT'
});

updateReport('metric', {
  value: profit,
  title: 'Прибыль',
  color: profit > 0 ? 'green' : 'red'
});
```

## Система событий и триггеров

```typescript
// Подписка на события
globals.events.subscribeOnTick(() => this.onSymbolTick('BTC/USDT'), this, 'BTC/USDT', 1000);

// Регистрация триггеров
globals.triggers.registerTimeHandler('myTrigger', this.myFunction, this);
globals.triggers.addTaskByTime({
  name: 'myTrigger',
  triggerTime: currentTime() + 60000,
  interval: 300000, // каждые 5 минут
  canReStore: true
});
```

## Логирование

```typescript
// Различные уровни логирования
log('Strategy', 'Информационное сообщение', { data: 'value' }, true);
trace('Strategy', 'Детальная информация', { data: 'value' }, true);
warning('Strategy', 'Предупреждение', { data: 'value' }, true);
error('Strategy', 'Ошибка', { data: 'value' });
debug('Strategy', 'Отладочная информация', { data: 'value' });
```

## Структура библиотеки

```
jt-lib-source/
├── src/
│   └── lib/
│       ├── core/                    # Ядро системы
│       │   ├── base-object.ts      # Базовый объект
│       │   ├── base-script.ts      # Базовый скрипт
│       │   ├── globals.ts          # Глобальное состояние
│       │   ├── storage.ts          # Хранение данных
│       │   └── log.ts              # Система логирования
│       ├── events/                  # Система событий
│       ├── exchange/                # Работа с биржами
│       ├── candles/                 # Управление свечами
│       ├── indicators/              # Технические индикаторы
│       ├── report/                  # Отчетность
│       ├── script/                  # Торговые скрипты
│       └── interfaces/              # TypeScript интерфейсы
```

## Документация

- [Введение и архитектура](introduction-architecture) - Обзор библиотеки
- [Основы и ядро](core-fundamentals) - Базовые компоненты
- [Торговые скрипты](trading-scripts) - Создание стратегий
- [Технические индикаторы](technical-indicators) - Анализ рынка
- [Система событий](events-system) - EventEmitter и триггеры
- [Управление ордерами](exchange-orders-basket) - OrdersBasket
- [Отчетность](reporting-system) - Создание отчетов
- [Обработка ошибок](error-handling) - Управление ошибками

## Поддержка

Для получения помощи и поддержки:

- Изучите документацию
- Обратитесь к сообществу
- Сообщите об ошибках

## Лицензия

JT-LIB доступен под двойной лицензией:

- **AGPLv3** - бесплатная лицензия для личного, образовательного и открытого использования
- **Коммерческая лицензия** - для коммерческого использования и SaaS решений
