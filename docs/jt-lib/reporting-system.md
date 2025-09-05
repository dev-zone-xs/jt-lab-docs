# Система отчетности (Report)

Система отчетности JT-Lib предоставляет мощные инструменты для создания, отображения и анализа результатов торговых стратегий. Отчеты отображаются в веб-интерфейсе и позволяют визуализировать данные в различных форматах.

## Обзор системы

Система отчетности включает в себя:

- **Виджеты** - различные типы отображения данных (карточки, таблицы, графики, текст)
- **Статистика** - автоматический анализ результатов торговли
- **Экспорт данных** - сохранение результатов в различных форматах
- **Интерактивность** - кнопки действий для управления стратегией в реальном времени

### Основные принципы работы

- Для тестера отчет должен обновляться в функции `onStop()` после завершения работы скрипта
- Для реальной торговли отчет может обновляться по временным интервалам (рекомендуется не чаще 5 секунд)
- Все логи автоматически добавляются в отчет по умолчанию

## Доступные объекты и быстрый старт

### Глобальный объект Report

Система отчетности предоставляет готовый к использованию глобальный объект `globals.report`, который автоматически инициализируется при запуске торгового скрипта. Все виджеты создаются автоматически при первом обращении к соответствующим методам.
### Быстрый старт

Система отчетности готова к использованию сразу после запуска торгового скрипта. Ниже приведены примеры типичного использования:

```typescript
// Настройка отчета
globals.report.setTitle('Grid Bot Example');
globals.report.setDescription('Multi-coin grid strategy example. Strategy logic is based in the GridBasket class.');

// Обновление карточек (виджеты создаются автоматически)
globals.report.cardSetValue('currentPrice', 50000);
globals.report.cardSetValue('profit', 1500, 'max');
globals.report.cardSetValue('totalOrders', 25);

// Обновление таблиц (виджеты создаются автоматически)
globals.report.tableUpdate('orders', {
  id: 1,
  symbol: 'BTC/USDT',
  side: 'buy',
  amount: 0.1,
  price: 50000,
  status: 'closed'
});

// Добавление данных на графики (виджеты создаются автоматически)
globals.report.chartAddPointAgg('profit', 'profit', 1500, 'max');
globals.report.chartAddPoint('balance', 'balance', Date.now(), 10000);

// Обновление отчета
await globals.report.updateReport();
```


> **Важно**: Не требуется создавать экземпляры виджетов вручную. Все виджеты создаются автоматически при первом вызове соответствующих методов.

### Виджеты (Widgets)

#### 1. Карточки (Cards)
```typescript
// Автоматическое создание и обновление значений
globals.report.cardSetValue(name: string, value: number|string, aggType?: AggType)

// Ручное создание (опционально)
globals.report.createCard(name: string, options: CardOptions)
globals.report.addCard(name: string, card: ReportCard)

// Получение существующего виджета
globals.report.getCardByName(name: string): ReportCard
```

#### 2. Таблицы (Tables)
```typescript
// Автоматическое создание и обновление данных
globals.report.tableUpdate(name: string, data: TableRow|TableRow[])

// Ручное создание (опционально)
globals.report.createTable(name: string, title: string)
globals.report.addTable(name: string, table: ReportTable)

// Получение существующего виджета
globals.report.getTableByName(name: string): ReportTable
```

#### 3. Графики (Charts)
```typescript
// Автоматическое создание и добавление данных
globals.report.chartAddPointAgg(name: string, lineName: string, value: number, aggType: AggType)
globals.report.chartAddPointAggByDate(name: string, lineName: string, value: number, aggType: AggType)
globals.report.chartAddPoint(name: string, lineName: string, valueX: number, valueY: number)

// Ручное создание (опционально)
globals.report.createChart(name: string, options: ChartOptions)
globals.report.addChart(name: string, chart: ReportChart)

// Получение существующего виджета
globals.report.getChartByName(name: string): ReportChart
```

#### 4. Текстовые блоки (Text)
```typescript
// Автоматическое создание
globals.report.createText(name: string, text: string, variant: string, align: string)

// Ручное создание (опционально)
globals.report.addText(name: string, text: ReportText)

// Получение существующего виджета
globals.report.getTextByName(name: string): ReportText
```

#### 5. Кнопки действий (Action Buttons)
```typescript
// Автоматическое создание
globals.report.createActionButton(title: string, action: string, value: string, callback?: Function, layoutIndex?: number)

// Ручное создание (опционально)
globals.report.addActionButton(name: string, button: ReportActionButton)

// Получение существующего виджета
globals.report.getActionButtonByName(name: string): ReportActionButton
```



### Типы данных

#### AggType (Типы агрегации)
```typescript
type AggType = 'last' | 'min' | 'max' | 'sum' | 'avg'
```

#### CardVariant (Типы карточек)
```typescript
enum CardVariant {
  Text = 'text',      // Текстовые значения
  Number = 'number',  // Числовые значения
  Percent = 'percent' // Процентные значения
}
```

#### ChartType (Типы графиков)
```typescript
enum ChartType {
  Line = 'line',  // Линейный график
  Area = 'area'   // График с заливкой
}
```

## Детальное описание виджетов

### 1. Карточки (Cards)

Карточки отображают отдельные значения переменных в удобном формате.

#### Создание карточки

```typescript
// Рекомендуемый способ - автоматическое создание при обновлении значения
globals.report.cardSetValue('profit', 1500, 'max');

// Ручное создание с настройками (если требуется кастомизация)
globals.report.createCard('profit', {
  title: 'Прибыль',
  variant: CardVariant.Number,
  options: {
    format: CardNumberFormat.Currency,
    currency: 'USD',
    icon: 'chart-up'
  }
});

// Создание экземпляра ReportCard (для продвинутого использования)
const profitCard = new ReportCard({
  title: 'Прибыль',
  variant: CardVariant.Number,
  options: {
    format: CardNumberFormat.Currency,
    currency: 'USD'
  }
});

globals.report.addCard('profit', profitCard);
```

#### Типы карточек

- **Text** - текстовые значения
- **Number** - числовые значения  
- **Percent** - процентные значения

#### Форматы отображения

- **Default** - стандартное отображение
- **Currency** - валютный формат
- **Date** - формат даты
- **Short** - сокращенный формат

#### Агрегация данных

```typescript
// Последнее значение
globals.report.cardSetValue('profit', 1500, 'last');

// Максимальное значение
globals.report.cardSetValue('maxProfit', 2000, 'max');

// Минимальное значение
globals.report.cardSetValue('minProfit', -500, 'min');

// Сумма
globals.report.cardSetValue('totalVolume', 10000, 'sum');

// Среднее значение
globals.report.cardSetValue('avgProfit', 150, 'avg');
```

#### Опции карточки

```typescript
interface CardOptions {
  format?: CardNumberFormat;  // Формат отображения
  currency?: string;          // Валюта
  icon?: string;             // Иконка
  caption?: string;          // Подпись
  isVisible?: boolean;       // Видимость
}
```

### 2. Таблицы (Tables)

Таблицы отображают структурированные данные в виде строк и столбцов.

#### Создание таблицы

```typescript
// Рекомендуемый способ - автоматическое создание при обновлении данных
globals.report.tableUpdate('orders', {
  id: 1,
  symbol: 'BTC/USDT',
  side: 'buy',
  amount: 0.1,
  price: 50000,
  status: 'closed'
});

// Ручное создание с заголовком (если требуется кастомизация)
globals.report.createTable('orders', 'История ордеров');

// Создание экземпляра ReportTable (для продвинутого использования)
const ordersTable = new ReportTable('История ордеров');
globals.report.addTable('orders', ordersTable);
```

#### Работа с данными

```typescript
// Добавление записи
globals.report.tableUpdate('orders', {
  id: 1,
  symbol: 'BTC/USDT',
  side: 'buy',
  amount: 0.1,
  price: 50000,
  status: 'closed',
  profit: 500
});

// Обновление записи
globals.report.tableUpdate('orders', {
  id: 1,
  status: 'closed',
  profit: 750
});

// Массовое обновление
const orders = [
  { id: 1, symbol: 'BTC/USDT', side: 'buy', amount: 0.1, price: 50000 },
  { id: 2, symbol: 'ETH/USDT', side: 'sell', amount: 1.0, price: 3000 }
];
globals.report.tableUpdate('orders', orders);
```

#### Методы ReportTable

```typescript
const table = globals.report.getTableByName('orders');

// Вставка записи
table.insert(row: TableRow, idField?: string): boolean

// Обновление записи
table.update(row: TableRow, idField?: string): boolean

// Вставка или обновление
table.upsert(row: TableRow, idField?: string): boolean

// Массовые операции
table.insertRecords(rows: TableRow[], idField?: string)
table.updateRecords(rows: TableRow[], idField?: string)
table.upsertRecords(rows: TableRow[], idField?: string)

// Очистка таблицы
table.clear(): boolean

// Установка лимита строк
table.setMaxRows(maxRows: number)
```

#### Ограничения таблиц

- Максимум 300 строк по умолчанию (настраивается)
- Автоматическое удаление старых записей при превышении лимита

### 3. Графики (Charts)

Графики визуализируют данные в виде линий или областей.

#### Создание графика

```typescript
// Рекомендуемый способ - автоматическое создание при добавлении данных
globals.report.chartAddPointAgg('profitChart', 'profit', 1500, 'max');

// Ручное создание с настройками (если требуется кастомизация)
globals.report.createChart('profitChart', {
  chartType: ChartType.Line,
  maxPoints: 1000,
  aggPeriod: 3600000 // 1 час
});

// Создание экземпляра ReportChart (для продвинутого использования)
const profitChart = new ReportChart('График прибыли', {
  chartType: ChartType.Area,
  maxPoints: 5000
});
globals.report.addChart('profitChart', profitChart);
```

#### Типы графиков

- **Line** - линейный график
- **Area** - график с заливкой

#### Добавление данных

```typescript
// Добавление точки с агрегацией
globals.report.chartAddPointAgg('profitChart', 'profit', 1500, 'max');

// Добавление точки по дате
globals.report.chartAddPointAggByDate('profitChart', 'profit', 1500, 'max');

// Настройка линий
const chart = globals.report.getChartByName('profitChart');
chart.setLineInfo('profit', 'max', '#3F51B5');
chart.setLineInfo('drawdown', 'min', '#FD6A6A');
```

#### Методы ReportChart

```typescript
const chart = globals.report.getChartByName('profitChart');

// Настройка линий
chart.setLineInfo(name: string, aggType: AggType, color?: string)

// Добавление точек
chart.addPoint(lineName: string, valueX: number, valueY: number, color?: string)
chart.addPointByDate(lineName: string, valueY: number, color?: string)
chart.addPointAggByDate(lineName: string, value: number, aggType: AggType, color?: string)

// Получение данных
chart.getLine(name: string): number[]
chart.getLength(): number

// Очистка
chart.clear()

// Настройка агрегации
chart.setAggPeriodByDates(start: number, end: number, dotCount: number)
```

#### Агрегация данных на графиках

- **last** - последнее значение
- **max** - максимальное значение
- **min** - минимальное значение
- **sum** - сумма значений
- **avg** - среднее значение

#### Опции графика

```typescript
interface ReportChartOptions {
  maxPoints?: number;    // Максимум точек (по умолчанию 5000)
  aggPeriod?: number;    // Период агрегации в мс (по умолчанию 1 день)
  chartType?: ChartType; // Тип графика
  layoutIndex?: number;  // Индекс в макете
}
```

### 4. Текстовые блоки (Text)

Текстовые блоки отображают произвольный текст в отчете.

#### Создание текстового блока

```typescript
// Рекомендуемый способ - прямое создание
globals.report.createText('summary', 'Сводка по стратегии', 'subtitle1', 'center');

// Создание экземпляра ReportText (для продвинутого использования)
const summaryText = new ReportText('Сводка по стратегии', 'subtitle1', 'center');
globals.report.addText('summary', summaryText);
```

#### Варианты отображения

- **h1, h2, h3** - заголовки разных уровней
- **subtitle1, subtitle2** - подзаголовки
- **body1, body2** - основной текст
- **caption** - мелкий текст

#### Выравнивание

- **left** - по левому краю
- **center** - по центру
- **right** - по правому краю

#### Опции текста

```typescript
interface TextOptions {
  variant?: string;  // Вариант отображения
  align?: string;    // Выравнивание
  isVisible?: boolean; // Видимость
}
```

### 5. Кнопки действий (Action Buttons)

Кнопки действий позволяют отправлять команды в работающий runtime.

#### Создание кнопки действия

```typescript
// Рекомендуемый способ - прямое создание
globals.report.createActionButton('Close Position', 'closePosition', 'BTC/USDT');

// Создание с callback функцией
globals.report.createActionButton('Start Trading', 'startTrading', '', async (data) => {
  this.isTrading = true;
  await globals.report.updateReport();
});

// Создание экземпляра ReportActionButton (для продвинутого использования)
const closeButton = new ReportActionButton('Закрыть позицию', 'closePosition', 'BTC/USDT');
globals.report.addActionButton('closeButton', closeButton);
```

#### Обработка действий

```typescript
async onReportAction(action: string, data: any) {
  switch (action) {
    case 'closePosition':
      await this.closePosition(data);
      break;
    case 'startTrading':
      this.isTrading = true;
      break;
    case 'stopTrading':
      this.isTrading = false;
      break;
  }
  
  await globals.report.updateReport();
}
```

> **Примечание**: Кнопки действий используются только для роботов реального времени, не для тестера.

## Статистика и анализ

### Автоматическая статистика

Система автоматически собирает статистику по торговым операциям:

```typescript
class Statistics extends BaseObject {
  ordersOpenedCnt = 0;      // Количество открытых ордеров
  ordersClosedCnt = 0;      // Количество закрытых ордеров
  ordersCanceledCnt = 0;    // Количество отмененных ордеров
  ordersModifiedCnt = 0;    // Количество измененных ордеров
  ordersTotalCnt = 0;       // Общее количество ордеров
  volume = 0;               // Общий объем торгов
  profit = 0;               // Общая прибыль
  bestTrade = 0;            // Лучшая сделка
  worstTrade = 0;           // Худшая сделка
}
```

### Создание отчета со статистикой

```typescript
  async onStop() {
    // Установка значений (карточки создаются автоматически)
    globals.report.cardSetValue('totalOrders', this.statistics.ordersTotalCnt);
    globals.report.cardSetValue('profit', this.statistics.profit);
    globals.report.cardSetValue('winRate', this.calculateWinRate());
    
    // Обновление отчета
    await globals.report.updateReport();
  }
```

## Экспорт данных

### Обновление отчета

```typescript
// Обновление отчета на сервере
await globals.report.updateReport();

// Принудительное обновление (игнорирует ограничения по частоте)
await globals.report.updateReport({ isForce: true });
```

### Структура данных отчета

```typescript
interface ReportData {
  id: string;           // Уникальный идентификатор отчета
  symbol: string;       // Торговый символ
  description?: string; // Описание отчета
  blocks: ReportBlock[]; // Блоки отчета
}

interface ReportBlock {
  type: ReportBlockType; // Тип блока
  name?: string;         // Имя блока
  data: ReportBlockData; // Данные блока
}
```

### Доступ к данным отчета

```typescript
// Получение данных отчета
const reportData = globals.report.getReportData();

// Экспорт в JSON
const jsonData = JSON.stringify(reportData, null, 2);
```

## Практические примеры

### Пример 1: Базовый отчет торговой стратегии

```typescript
class Script extends BaseScript {
  async onInit() {
    // Настройка отчета
    globals.report.setTitle('Trading Strategy Report');
    globals.report.setDescription('Automated trading strategy with real-time monitoring');
    
    // Виджеты создаются автоматически при первом обращении
    // Никаких дополнительных действий не требуется
  }
  
  async onTick() {
    // Обновление карточек (виджеты создаются автоматически)
    globals.report.cardSetValue('currentPrice', this.getCurrentPrice());
    globals.report.cardSetValue('position', this.getPositionStatus());
    
    // Добавление точки на график (виджет создается автоматически)
    globals.report.chartAddPointAggByDate('profit', 'profit', this.getTotalProfit(), 'max');
    
    // Обновление отчета каждые 5 тиков
    if (this.tickCount % 5 === 0) {
      await globals.report.updateReport();
    }
  }
  
  async onOrderChange(order: Order) {
    // Добавление ордера в таблицу (виджет создается автоматически)
    globals.report.tableUpdate('orders', {
      id: order.id,
      symbol: order.symbol,
      side: order.side,
      amount: order.amount,
      price: order.price,
      status: order.status,
      timestamp: new Date().toISOString()
    });
  }
  
  async onStop() {
    // Финальное обновление отчета
    await globals.report.updateReport();
  }
}
```

### Пример 2: Отчет с оптимизацией

```typescript
class Script extends BaseScript {
  async onStop() {
    // Добавление параметров оптимизации
    globals.report.optimizedSetValue('profit', this.totalProfit, 'max');
    globals.report.optimizedSetValue('drawdown', this.maxDrawdown, 'min');
    globals.report.optimizedSetValue('winRate', this.winRate, 'avg');
    globals.report.optimizedSetValue('sharpeRatio', this.sharpeRatio, 'max');
    
    // Создание таблицы результатов оптимизации
    globals.report.createTable('optimization', 'Результаты оптимизации');
    globals.report.tableUpdate('optimization', {
      parameter: 'RSI Period',
      value: this.rsiPeriod,
      profit: this.totalProfit,
      drawdown: this.maxDrawdown,
      winRate: this.winRate
    });
    
    await globals.report.updateReport();
  }
}
```

### Пример 3: Интерактивный отчет

```typescript
class Script extends BaseScript {
  async onInit() {
    // Создание кнопок управления
    globals.report.createActionButton('Start Trading', 'startTrading', '');
    globals.report.createActionButton('Stop Trading', 'stopTrading', '');
    globals.report.createActionButton('Close All Positions', 'closeAll', '');
    
    // Информационные карточки создаются автоматически при обновлении значений
  }
  
  async onReportAction(action: string, data: any) {
    switch (action) {
      case 'startTrading':
        this.isTrading = true;
        globals.report.cardSetValue('status', 'Торговля активна');
        break;
        
      case 'stopTrading':
        this.isTrading = false;
        globals.report.cardSetValue('status', 'Торговля остановлена');
        break;
        
      case 'closeAll':
        await this.closeAllPositions();
        globals.report.cardSetValue('status', 'Все позиции закрыты');
        break;
    }
    
    await globals.report.updateReport();
  }
}
```

## Рекомендации по использованию

### Производительность

1. **Частота обновлений**: Не обновляйте отчет чаще 5 секунд в реальной торговле
2. **Ограничение данных**: Используйте разумные лимиты для таблиц и графиков
3. **Агрегация**: Используйте агрегацию для больших объемов данных

### Структура отчета

1. **Заголовок**: Всегда устанавливайте заголовок и описание отчета
2. **Логическая группировка**: Группируйте связанные виджеты вместе
3. **Приоритет информации**: Размещайте наиболее важную информацию в начале отчета

### Отладка

1. **Логирование**: Используйте встроенное логирование для отладки
2. **Валидация данных**: Проверяйте корректность данных перед добавлением в отчет
3. **Обработка ошибок**: Обрабатывайте ошибки при создании и обновлении виджетов

Система отчетности JT-Lib предоставляет все необходимые инструменты для создания информативных и интерактивных отчетов торговых стратегий, позволяя трейдерам эффективно анализировать результаты и принимать обоснованные решения.