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

Технические индикаторы в JT-LIB предоставляют мощный инструментарий для анализа рынка и создания сложных торговых стратегий. Правильное использование встроенных индикаторов критически важно для успешной торговли.
