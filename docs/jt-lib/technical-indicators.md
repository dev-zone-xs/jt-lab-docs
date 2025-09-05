---
id: technical-indicators
title: Технические индикаторы (Indicators)
sidebar_label: Технические индикаторы
---

# Технические индикаторы (Indicators)

**Indicators** — это система технических индикаторов для анализа рыночных данных. JT-LIB предоставляет встроенные индикаторы и возможность создания собственных.

## Архитектура индикаторов

### BaseIndicator - базовый класс

Все индикаторы наследуются от `BaseIndicator`, который предоставляет:

- **Интеграция с CandlesBuffer** — автоматическое получение свечных данных
- **Буферизация результатов** — кэширование вычисленных значений
- **Оптимизация производительности** — пересчет только новых данных
- **Управление жизненным циклом** — автоматическая очистка ресурсов

### Основные методы

```typescript
class BaseIndicator {
  // Получение последнего значения
  getValue(shift = 0): number;
  
  // Получение всех значений
  getIndicatorValues(): BufferIndicatorItem[];
  
  // Очистка буфера
  clear(): void;
  
  // Информация об индикаторе
  getInfo(): IndicatorInfo;
}
```

## Встроенные индикаторы

### 1. RSI (Relative Strength Index)

**RSI** — индикатор относительной силы, показывает перекупленность/перепроданность рынка.

```typescript
// Создание RSI индикатора
const rsi = await globals.indicators.rsi('BTC/USDT', '1h', 14);

// Получение текущего значения
const currentRsi = rsi.getValue();

// Получение значения с отступом
const previousRsi = rsi.getValue(1);

// Получение всех значений
const allValues = rsi.getIndicatorValues();
```

**Параметры:**
- `symbol` — торговый символ
- `timeframe` — таймфрейм ('1m', '5m', '1h', '1d', etc.)
- `period` — период расчета (по умолчанию 14)

**Интерпретация:**
- **RSI > 70** — перекупленность (сигнал на продажу)
- **RSI < 30** — перепроданность (сигнал на покупку)

### 2. SMA (Simple Moving Average)

**SMA** — простая скользящая средняя, сглаживает ценовые колебания.

```typescript
// Создание SMA индикатора
const sma = await globals.indicators.sma('BTC/USDT', '1h', 20);

// Получение текущего значения
const currentSma = sma.getValue();

// Сравнение цены с SMA
const currentPrice = this.basket.close();
if (currentPrice > currentSma) {
  log('Strategy', 'Цена выше SMA - восходящий тренд', { currentPrice, smaValue: currentSma }, true);
}
```

**Параметры:**
- `symbol` — торговый символ
- `timeframe` — таймфрейм
- `period` — период расчета (по умолчанию 14)

### 3. ATR (Average True Range)

**ATR** — средний истинный диапазон, показывает волатильность рынка.

```typescript
// Создание ATR индикатора
const atr = await globals.indicators.atr('BTC/USDT', '1h', 14);

// Получение текущей волатильности
const currentAtr = atr.getValue();

// Использование ATR для расчета стоп-лосса
const stopLossDistance = currentAtr * 2; // 2 ATR
const stopLoss = currentPrice - stopLossDistance;
```

**Параметры:**
- `symbol` — торговый символ
- `timeframe` — таймфрейм
- `period` — период расчета (по умолчанию 14)

## Создание собственных индикаторов

### Структура пользовательского индикатора

```typescript
import { BaseIndicator } from 'jt-lib';
import { CandlesBuffer } from 'jt-lib';

interface CustomIndicatorOptions {
  symbol: string;
  timeframe: TimeFrame;
  period: number;
  // Дополнительные параметры
}

export class CustomIndicator extends BaseIndicator {
  private readonly period: number;
  private lastIndex = 0;
  private lastTimeUpdated = 0;
  
  // Дополнительные переменные для расчетов
  private sum = 0;
  private values: number[] = [];

  constructor(buffer: CandlesBuffer, options: CustomIndicatorOptions) {
    super(options.symbol, options.timeframe, buffer);
    this.period = options.period;
  }

  protected onCalculate(): void {
    const candles = this.candlesBuffer.getCandles();
    
    // Проверка на новые данные
    if (this.lastTimeUpdated >= this.candlesBuffer.getLastTimeUpdated()) {
      return;
    }
    
    // Проверка достаточности данных
    if (candles.length < this.period) {
      return;
    }

    // Первоначальный расчет
    if (this.lastIndex === 0) {
      // Инициализация переменных
      this.sum = 0;
      for (let i = 0; i < this.period; i++) {
        this.sum += candles[i].close;
      }
      this.lastIndex = this.period - 1;
      
      const avg = this.sum / this.period;
      this.buffer.push({ 
        timestamp: candles[this.period - 1].timestamp, 
        value: avg 
      });
    }

    // Инкрементальный расчет
    const startIndex = this.lastIndex + 1;
    for (let i = startIndex; i < candles.length; i++) {
      // Обновление скользящего окна
      this.sum = this.sum - candles[i - this.period].close + candles[i].close;
      
      const avg = this.sum / this.period;
      this.buffer.push({ 
        timestamp: candles[i].timestamp, 
        value: avg 
      });
      
      this.lastTimeUpdated = candles[i].timestamp;
      this.lastIndex = i;
    }
  }

  getIndicatorValues() {
    this.onCalculate();
    return this.buffer;
  }

  getValue(shift = 0): number {
    this.onCalculate();
    const idx = this.buffer.length - 1 - shift;
    return idx >= 0 ? this.buffer[idx]?.value : undefined;
  }
}
```

### Регистрация пользовательского индикатора

```typescript
// Расширение класса Indicators
class CustomIndicators extends Indicators {
  async customIndicator(
    symbol: string, 
    timeframe: TimeFrame, 
    period = 14
  ): Promise<CustomIndicator> {
    const candlesBuffer = await globals.candlesBufferService.getBuffer({ symbol, timeframe });
    return new CustomIndicator(candlesBuffer, { symbol, timeframe, period });
  }
}

// Использование в скрипте
class Script extends BaseScript {
  private customInd: CustomIndicator;

  async onInit() {
    // Создание пользовательского индикатора
    this.customInd = await globals.indicators.customIndicator('BTC/USDT', '1h', 20);
  }

  async onTick() {
    const value = this.customInd.getValue();
    trace('CustomIndicator', 'Custom indicator value', { value }, true);
  }
}
```

## Использование в торговых стратегиях

### Пример: RSI стратегия

```typescript
class Script extends BaseScript {
  private rsi: RelativeStrengthIndex;
  private sma: SimpleMovingAverageIndicator;
  private isPositionOpened = false;

  async onInit() {
    // Создание индикаторов
    this.rsi = await globals.indicators.rsi(this.symbols[0], '1h', 14);
    this.sma = await globals.indicators.sma(this.symbols[0], '1h', 20);
  }

  async onTick() {
    if (this.isPositionOpened) return;

    const currentPrice = this.basket.close();
    const rsiValue = this.rsi.getValue();
    const smaValue = this.sma.getValue();

    // Сигнал на покупку
    if (rsiValue < 30 && currentPrice > smaValue) {
      const amount = this.basket.getContractsAmount(100);
      await this.basket.buyMarket(amount);
      this.isPositionOpened = true;
    }

    // Сигнал на продажу
    if (rsiValue > 70 && currentPrice < smaValue) {
      const amount = this.basket.getContractsAmount(100);
      await this.basket.sellMarket(amount);
      this.isPositionOpened = true;
    }
  }

  async onOrderChange(order: Order) {
    if (order.status === 'closed') {
      this.isPositionOpened = false;
    }
  }
}
```

### Пример: Мульти-таймфрейм анализ

```typescript
class Script extends BaseScript {
  private rsi1h: RelativeStrengthIndex;
  private rsi4h: RelativeStrengthIndex;
  private sma1h: SimpleMovingAverageIndicator;
  private sma4h: SimpleMovingAverageIndicator;

  async onInit() {
    const symbol = this.symbols[0];
    
    // Индикаторы на разных таймфреймах
    this.rsi1h = await globals.indicators.rsi(symbol, '1h', 14);
    this.rsi4h = await globals.indicators.rsi(symbol, '4h', 14);
    this.sma1h = await globals.indicators.sma(symbol, '1h', 20);
    this.sma4h = await globals.indicators.sma(symbol, '4h', 20);
  }

  async onTick() {
    // Анализ тренда на старшем таймфрейме
    const trend4h = this.getTrend4h();
    
    // Анализ входа на младшем таймфрейме
    const entry1h = this.getEntry1h();

    if (trend4h === 'bullish' && entry1h === 'buy') {
      // Покупка в направлении тренда
      const amount = this.basket.getContractsAmount(100);
      await this.basket.buyMarket(amount);
    }
  }

  private getTrend4h(): 'bullish' | 'bearish' | 'neutral' {
    const price = this.basket.close();
    const sma4hValue = this.sma4h.getValue();
    
    if (price > sma4hValue) return 'bullish';
    if (price < sma4hValue) return 'bearish';
    return 'neutral';
  }

  private getEntry1h(): 'buy' | 'sell' | 'hold' {
    const rsi1hValue = this.rsi1h.getValue();
    
    if (rsi1hValue < 30) return 'buy';
    if (rsi1hValue > 70) return 'sell';
    return 'hold';
  }
}
```

## Оптимизация производительности

### 1. Инкрементальные расчеты

**Принцип:** Пересчитывать только новые данные, а не весь буфер.

```typescript
protected onCalculate(): void {
  const candles = this.candlesBuffer.getCandles();
  
  // Проверка на новые данные
  if (this.lastTimeUpdated >= this.candlesBuffer.getLastTimeUpdated()) {
    return; // Нет новых данных
  }
  
  // Расчет только новых свечей
  const startIndex = this.lastIndex + 1;
  for (let i = startIndex; i < candles.length; i++) {
    // Расчет для свечи i
    const value = this.calculateForCandle(candles[i]);
    this.buffer.push({ timestamp: candles[i].timestamp, value });
  }
  
  this.lastIndex = candles.length - 1;
  this.lastTimeUpdated = candles[candles.length - 1].timestamp;
}
```

### 2. Кэширование результатов

```typescript
class OptimizedIndicator extends BaseIndicator {
  private cache = new Map<string, number>();
  
  getValue(shift = 0): number {
    const cacheKey = `${this.buffer.length}-${shift}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    this.onCalculate();
    const value = this.buffer[this.buffer.length - 1 - shift]?.value;
    this.cache.set(cacheKey, value);
    
    return value;
  }
}
```

### 3. Ленивая инициализация

```typescript
class LazyIndicator extends BaseIndicator {
  private isInitialized = false;
  
  getValue(shift = 0): number {
    if (!this.isInitialized) {
      this.initialize();
      this.isInitialized = true;
    }
    
    this.onCalculate();
    return this.buffer[this.buffer.length - 1 - shift]?.value;
  }
  
  private initialize(): void {
    // Инициализация только при первом обращении
    const candles = this.candlesBuffer.getCandles();
    if (candles.length >= this.period) {
      this.calculateInitialValues();
    }
  }
}
```

### 4. Оптимизация памяти

```typescript
class MemoryOptimizedIndicator extends BaseIndicator {
  private maxBufferSize = 1000; // Максимальный размер буфера
  
  protected onCalculate(): void {
    // ... расчеты ...
    
    // Ограничение размера буфера
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer = this.buffer.slice(-this.maxBufferSize);
    }
  }
}
```

## Лучшие практики

### 1. Проверка достаточности данных

```typescript
protected onCalculate(): void {
  const candles = this.candlesBuffer.getCandles();
  
  // Всегда проверяйте достаточность данных
  if (candles.length < this.period) {
    return;
  }
  
  // ... расчеты ...
}
```

### 2. Обработка ошибок

```typescript
getValue(shift = 0): number {
  try {
    this.onCalculate();
    const idx = this.buffer.length - 1 - shift;
    return idx >= 0 ? this.buffer[idx]?.value : undefined;
  } catch (error) {
    error('CustomIndicator', 'Error calculating indicator value', { error: error.message });
    return undefined;
  }
}
```

### 3. Валидация параметров

```typescript
constructor(buffer: CandlesBuffer, options: IndicatorOptions) {
  super(options.symbol, options.timeframe, buffer);
  
  if (!options.period || options.period < 1) {
    throw new Error('Period must be greater than 0');
  }
  
  this.period = options.period;
}
```

### 4. Документирование индикатора

```typescript
/**
 * Custom Moving Average - пользовательская скользящая средняя
 * 
 * @param symbol - торговый символ
 * @param timeframe - таймфрейм
 * @param period - период расчета
 * @param multiplier - множитель для весов
 */
export class CustomMovingAverage extends BaseIndicator {
  // ... реализация ...
}
```

## Интеграция с системой

### Доступ через globals

```typescript
// В BaseScript автоматически доступен
class Script extends BaseScript {
  async onInit() {
    // Создание индикаторов
    const rsi = await globals.indicators.rsi('BTC/USDT', '1h', 14);
    const sma = await globals.indicators.sma('BTC/USDT', '1h', 20);
  }
}
```

### Управление жизненным циклом

```typescript
class Script extends BaseScript {
  private indicators: BaseIndicator[] = [];

  async onInit() {
    // Создание индикаторов
    this.indicators.push(
      await globals.indicators.rsi('BTC/USDT', '1h', 14),
      await globals.indicators.sma('BTC/USDT', '1h', 20)
    );
  }

  async onStop() {
    // Автоматическая очистка при остановке скрипта
    this.indicators.forEach(ind => ind.clear());
  }
}
```

Технические индикаторы в JT-LIB предоставляют мощный инструментарий для анализа рынка и создания сложных торговых стратегий. Правильное использование индикаторов и оптимизация их производительности критически важны для успешной торговли.
