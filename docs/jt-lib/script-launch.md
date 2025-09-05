---
id: script-launch
title: Запуск скрипта
sidebar_label: Запуск скрипта
---

# Запуск скрипта

Для запуска торгового скрипта в JT-Trader необходимо создать сценарий (runtime), который будет запускать класс Script, определенный в файле стратегии.

## Как это работает

1. **В JT-Trader** вы создаете сценарий (runtime) с настройками
2. **Сценарий** указывает на файл с классом Script
3. **При запуске** JT-Trader выполняет класс Script из указанного файла
4. **Класс Script** наследуется от BaseScript и содержит логику торговой стратегии

## Создание сценария в JT-Trader

### 1. Переход на вкладку Runtime

В интерфейсе JT-Trader перейдите на вкладку Runtime, где отображаются все запущенные и остановленные торговые скрипты.

### 2. Создание нового сценария

Нажмите кнопку **Create Runtime** для создания нового сценария запуска скрипта.

![Create Runtime Screenshot](/images/create-scanerio-runtime.jpg)

### 3. Настройка параметров сценария

При создании сценария необходимо указать следующие обязательные параметры:

**Основные параметры:**
- **Name** - Название сценария для идентификации
- **Script** - Файл торгового скрипта

**Параметры подключения:**
- **Connection** - Выберите подключение к бирже из списка доступных соединений
- **Symbols** - Список торговых пар, разделенных запятыми (например: `BTC/USDT:USDT,ETH/USDT:USDT,ADA/USDT:USDT`)

### 4. Пользовательские параметры

В разделе **Parameters** вы можете добавить пользовательские параметры, которые будут переданы в скрипт. Эти параметры настраиваются разработчиком скрипта и могут включать цены покупки/продажи, объемы торговли, настройки стоп-лосса и другие параметры стратегии.

#### Типы параметров

JT-Trader поддерживает три типа параметров:

- **String** - строковые значения (например, названия, описания)
- **Number** - числовые значения (цены, объемы, проценты)
- **Boolean** - логические значения (включить/выключить функции)

#### Примеры пользовательских параметров

```typescript
// Параметры стратегии
buyPrice: 50000          // Цена покупки
sellPrice: 55000         // Цена продажи
volume: 0.001           // Объем торговли
stopLoss: 45000         // Стоп-лосс
takeProfit: 60000       // Тейк-профит
isDebug: true           // Режим отладки
strategyName: "SMA"     // Название стратегии
leverage: 10            // Плечо для фьючерсов
```

### 5. Настройка пользовательских параметров

В разделе **Parameters** добавьте параметры, которые будут переданы в скрипт. Каждый параметр должен иметь:

- **Name** - имя параметра (должно совпадать с именем в коде скрипта)
- **Type** - тип параметра (String, Number, Boolean)
- **Value** - значение параметра
- **Description** - описание параметра (опционально)

#### Пример настройки параметров

| Name | Type | Value | Description |
|------|------|-------|-------------|
| buyPrice | Number | 50000 | Цена покупки |
| sellPrice | Number | 55000 | Цена продажи |
| volume | Number | 0.001 | Объем торговли |
| stopLoss | Number | 45000 | Стоп-лосс |
| takeProfit | Number | 60000 | Тейк-профит |
| isDebug | Boolean | true | Режим отладки |
| strategyName | String | "SMA Strategy" | Название стратегии |

### 6. Сохранение и запуск

После настройки всех параметров нажмите кнопку **Save** для сохранения сценария, а затем кнопку **Run** для запуска скрипта. При запуске скрипту будут переданы все указанные параметры подключения, а также пользовательские параметры, если они были добавлены.

## Что происходит при запуске

После нажатия кнопки **Run** JT-Trader выполняет следующие действия:

1. **Подключается к бирже** - Устанавливает WebSocket соединение с выбранной биржей
2. **Подписывается на события** - Подписывается на следующие события:
   - **Изменение баланса** - Получение обновлений о состоянии счета
   - **Приход котировок** - Получение новых тиков по указанным символам
   - **Изменение позиций** - Отслеживание открытых позиций
   - **Изменение ордеров** - Мониторинг статуса всех ордеров
3. **Загружает файл** - Читает указанный файл  
4. **Находит класс Script** - Ищет класс, и создает его в окружении 
5. **Создает экземпляр** - Создает объект этого класса
6. **Передает параметры** - Передает все настройки сценария в скрипт
7. **Запускает выполнение** - Начинает выполнение методов жизненного цикла

## Система аргументов и параметров

### Глобальная переменная ARGS

При запуске скрипта JT-Trader автоматически создает глобальную переменную `ARGS`, которая содержит все параметры, переданные при создании сценария. Эта переменная доступна во всех частях кода через специальные функции.

### Функции для работы с аргументами

JT-Trader предоставляет набор функций для безопасного извлечения параметров из глобальной переменной `ARGS`:

#### getArgNumber(name, defaultValue?, required?)
Безопасно извлекает числовой аргумент с проверкой типов:
```typescript
const buyPrice = getArgNumber('buyPrice', 50000);        // С значением по умолчанию
const volume = getArgNumber('volume', undefined, true);  // Обязательный параметр
```

#### getArgString(name, defaultValue?, required?)
Безопасно извлекает строковый аргумент:
```typescript
const strategyName = getArgString('strategyName', 'DefaultStrategy');
const connectionName = getArgString('connectionName', undefined, true);
```

#### getArgBoolean(name, defaultValue?, required?)
Безопасно извлекает булевый аргумент:
```typescript
const isDebug = getArgBoolean('isDebug', false);
const enableLogging = getArgBoolean('enableLogging', true);
```

### Обязательные параметры

JT-Trader автоматически передает следующие обязательные параметры:

- **connectionName** - название подключения к бирже
- **symbols** - список торговых пар (строка через запятую)
- **symbol** - первый символ из списка (для совместимости)

### Параметры тестера (только в режиме тестирования)

При запуске в режиме тестирования дополнительно доступны:

- **start** - дата начала тестирования (например: "2021-01")
- **end** - дата окончания тестирования (например: "2021-12")
- **timeframe** - таймфрейм для тестирования
- **balance** - начальный баланс
- **leverage** - плечо
- **makerFee** - комиссия мейкера
- **takerFee** - комиссия тейкера

### Пример использования аргументов

```typescript
class Script extends BaseScript {
  private buyPrice: number;
  private sellPrice: number;
  private volume: number;
  private isDebug: boolean;
  private strategyName: string;

  async onInit() {
    // Получение обязательных параметров
    const connectionName = getArgString('connectionName', undefined, true);
    const symbols = getArgString('symbols', undefined, true);
    
    // Получение пользовательских параметров
    this.buyPrice = getArgNumber('buyPrice', 50000);
    this.sellPrice = getArgNumber('sellPrice', 55000);
    this.volume = getArgNumber('volume', 0.001);
    this.isDebug = getArgBoolean('isDebug', false);
    this.strategyName = getArgString('strategyName', 'DefaultStrategy');
    
    // Логирование полученных параметров
    log('Script', 'Параметры стратегии', {
      connectionName,
      symbols,
      buyPrice: this.buyPrice,
      sellPrice: this.sellPrice,
      volume: this.volume,
      isDebug: this.isDebug,
      strategyName: this.strategyName
    }, true);
  }
}
```

## Класс Script в файле стратегии

В файле стратегии должен быть определен класс Script, который наследуется от BaseScript. Этот класс содержит всю логику торговой стратегии.

### Структура класса Script

```typescript
class Script extends BaseScript {
  // Параметры стратегии
  private buyPrice: number;
  private sellPrice: number;
  private volume: number;
  private stopLoss: number;
  private takeProfit: number;
  private isDebug: boolean;
  private strategyName: string;

  // Инициализация стратегии
  async onInit() {
    // Получение обязательных параметров
    const connectionName = getArgString('connectionName', undefined, true);
    const symbols = getArgString('symbols', undefined, true);
    
    // Получение пользовательских параметров
    this.buyPrice = getArgNumber('buyPrice', 50000);
    this.sellPrice = getArgNumber('sellPrice', 55000);
    this.volume = getArgNumber('volume', 0.001);
    this.stopLoss = getArgNumber('stopLoss', 45000);
    this.takeProfit = getArgNumber('takeProfit', 60000);
    this.isDebug = getArgBoolean('isDebug', false);
    this.strategyName = getArgString('strategyName', 'SimpleStrategy');
    
    // Логирование параметров
    log('Script', 'Стратегия инициализирована', {
      strategyName: this.strategyName,
      connectionName,
      symbols,
      buyPrice: this.buyPrice,
      sellPrice: this.sellPrice,
      volume: this.volume,
      stopLoss: this.stopLoss,
      takeProfit: this.takeProfit,
      isDebug: this.isDebug
    }, true);
  }

  // Обработка новых тиков (только для первого символа)
  async onTick(data: Tick) {
    const currentPrice = data.close;
    
    // Логика торговой стратегии
    if (currentPrice <= this.buyPrice) {
      await this.buyMarket(this.volume);
      log('TradingStrategy', 'Купили по цене', { 
        currentPrice, 
        volume: this.volume,
        stopLoss: this.stopLoss,
        takeProfit: this.takeProfit
      }, this.isDebug);
    }
    
    if (currentPrice >= this.sellPrice) {
      await this.sellMarket(this.volume);
      log('TradingStrategy', 'Продали по цене', { 
        currentPrice, 
        volume: this.volume 
      }, this.isDebug);
    }
  }

  // Обработка изменений ордеров
  async onOrderChange(order: Order) {
    log('OrderManager', 'Ордер изменил статус', { 
      orderId: order.id, 
      status: order.status,
      symbol: order.symbol,
      side: order.side
    }, this.isDebug);
  }

  // Завершение работы
  async onStop() {
    log('Script', 'Стратегия остановлена', {
      strategyName: this.strategyName
    }, true);
  }
}
```

## Лучшие практики работы с параметрами

### Валидация параметров

Всегда проверяйте корректность полученных параметров:

```typescript
async onInit() {
  // Валидация числовых параметров
  this.buyPrice = getArgNumber('buyPrice', 50000);
  if (this.buyPrice <= 0) {
    throw new Error('Цена покупки должна быть больше 0');
  }
  
  // Валидация объемов
  this.volume = getArgNumber('volume', 0.001);
  if (this.volume <= 0 || this.volume > 1) {
    throw new Error('Объем должен быть от 0 до 1');
  }
  
  // Валидация логических параметров
  this.isDebug = getArgBoolean('isDebug', false);
}
```

### Использование значений по умолчанию

Всегда указывайте разумные значения по умолчанию для всех параметров:

```typescript
// Хорошо - есть значение по умолчанию
const buyPrice = getArgNumber('buyPrice', 50000);

// Плохо - может вызвать ошибку
const buyPrice = getArgNumber('buyPrice'); // undefined если параметр не передан
```

### Обязательные параметры

Используйте флаг `required: true` только для критически важных параметров:

```typescript
// Обязательные параметры
const connectionName = getArgString('connectionName', undefined, true);
const symbols = getArgString('symbols', undefined, true);

// Пользовательские параметры с значениями по умолчанию
const buyPrice = getArgNumber('buyPrice', 50000);
const volume = getArgNumber('volume', 0.001);
```

### Логирование параметров

Всегда логируйте полученные параметры для отладки:

```typescript
async onInit() {
  // Получение всех параметров
  const params = {
    buyPrice: getArgNumber('buyPrice', 50000),
    sellPrice: getArgNumber('sellPrice', 55000),
    volume: getArgNumber('volume', 0.001),
    isDebug: getArgBoolean('isDebug', false)
  };
  
  // Логирование для отладки
  log('Script', 'Параметры стратегии', params, true);
}
```

### Обработка ошибок

Обрабатывайте ошибки получения параметров:

```typescript
try {
  this.buyPrice = getArgNumber('buyPrice', 50000);
} catch (error) {
  log('Script', 'Ошибка получения параметра buyPrice', { error: error.message }, true);
  this.buyPrice = 50000; // Используем значение по умолчанию
}
```
