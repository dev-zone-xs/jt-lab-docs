---
id: market-data-candles
title: Рыночные данные (Candles)
sidebar_label: Рыночные данные
---

# Рыночные данные (Candles)

JT-LIB предоставляет мощную систему для работы с рыночными данными, включая получение исторических свечей, буферизацию данных и анализ рынка. Система построена вокруг `CandlesBuffer` для эффективного управления данными и `getHistory` для получения исторических данных.

## Получение свечей - исторические данные

### Функция getHistory

**`getHistory`** — основная функция для получения исторических данных свечей.

```typescript
getHistory(symbol: string, timeframe: TimeFrame, startTime: number, limit?: number): Promise<OHLC[]>
```

**Параметры:**
- `symbol` — торговый символ (например, 'BTC/USDT')
- `timeframe` — таймфрейм свечей ('1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M')
- `startTime` — время начала в миллисекундах
- `limit` — количество свечей (по умолчанию: максимально доступное)

**Возвращает:** Массив свечей в формате `[timestamp, open, high, low, close, volume]`

### Примеры использования

```typescript
// Получение последних 100 свечей за 1 час
const timeFrom = tms() - 1000 * 60 * 60 * 24 * 7; // 7 дней назад
const candles = await getHistory('BTC/USDT', '1h', timeFrom, 100);

// Получение дневных свечей за последний месяц
const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
const dailyCandles = await getHistory('ETH/USDT', '1d', monthAgo, 30);

// Получение минутных свечей для анализа
const minuteCandles = await getHistory('BTC/USDT', '1m', Date.now() - 60 * 60 * 1000, 60);
```

### Формат данных свечей

```typescript
// Каждая свеча представлена массивом:
type OHLC = [number, number, number, number, number, number];
// [timestamp, open, high, low, close, volume]

// Пример:
const candle = [1614556800000, 50000, 51000, 49000, 50500, 1000];
// timestamp: 1614556800000 (время открытия свечи)
// open: 50000 (цена открытия)
// high: 51000 (максимальная цена)
// low: 49000 (минимальная цена)
// close: 50500 (цена закрытия)
// volume: 1000 (объем торгов)
```

## CandlesBuffer - буферизация данных

**`CandlesBuffer`** — класс для эффективного управления буфером свечей с автоматическим обновлением. В JT-LIB буферы управляются через глобальный сервис `CandlesBufferService`, который предотвращает создание дублирующих буферов для одинаковых символов и таймфреймов.

### Основные возможности

- **Глобальное кэширование** — один буфер на комбинацию symbol+timeframe
- **Автоматическое обновление** — подписка на события `onTick` для обновления данных
- **Предзагрузка данных** — автоматическая загрузка исторических данных при инициализации
- **Управление размером буфера** — ограничение максимального размера буфера
- **Доступ к OHLC данным** — методы для получения open, high, low, close, volume

### Получение буфера через глобальный сервис

```typescript
// Получение буфера через глобальный сервис (рекомендуемый способ)
const buffer = await globals.candlesBufferService.getBuffer({
  symbol: 'BTC/USDT',
  timeframe: '1h',
  preloadCandlesCount: 250, // количество свечей для предзагрузки
  maxBufferLength: 1000     // максимальный размер буфера
});

// Буфер автоматически инициализируется и кэшируется
// При повторном запросе с теми же параметрами вернется существующий буфер
```

### Параметры CandlesBufferOptions

```typescript
interface CandlesBufferOptions {
  symbol: string;                    // торговый символ
  timeframe: string | number;        // таймфрейм
  preloadCandlesCount?: number;      // количество свечей для предзагрузки (по умолчанию: 250)
  maxBufferLength?: number;          // максимальный размер буфера (по умолчанию: 1000)
}
```

### Как работает кэширование

Сервис `CandlesBufferService` создает уникальный ключ для каждого буфера: `${symbol}-${timeframe}`. При первом запросе создается новый буфер, при повторных запросах с теми же параметрами возвращается существующий буфер.

### Методы CandlesBuffer

```typescript
// Получение всех свечей
const candles = buffer.getCandles();

// Получение конкретной свечи (shift = 0 - последняя свеча)
const lastCandle = buffer.getCandle(0);
const prevCandle = buffer.getCandle(1);

// Получение OHLC данных последней свечи
const close = buffer.close();
const high = buffer.high();
const low = buffer.low();
const open = buffer.open();
const volume = buffer.volume();
const timestamp = buffer.tms();

// Очистка буфера
buffer.clear();

// Получение времени последнего обновления
const lastUpdate = buffer.getLastTimeUpdated();
```

## Временные интервалы - работа с таймфреймами

### Поддерживаемые таймфреймы

JT-LIB поддерживает следующие таймфреймы:

| Таймфрейм | Минуты | Описание |
|-----------|--------|----------|
| `'1m'` | 1 | 1 минута |
| `'5m'` | 5 | 5 минут |
| `'15m'` | 15 | 15 минут |
| `'1h'` | 60 | 1 час |
| `'4h'` | 240 | 4 часа |
| `'1d'` | 1440 | 1 день |
| `'1w'` | 10080 | 1 неделя |
| `'1M'` | 43200 | 1 месяц |

### Конвертация таймфреймов

```typescript
import { convertTimeframeToString, convertTimeframeToNumber } from 'jt-lib';

// Конвертация в строку
const tfString = convertTimeframeToString(60); // '1h'
const tfString2 = convertTimeframeToString('m60'); // '1h'

// Конвертация в число (минуты)
const tfNumber = convertTimeframeToNumber('1h'); // 60
const tfNumber2 = convertTimeframeToNumber('1d'); // 1440
```

### Округление времени по таймфрейму

```typescript
import { roundTimeByTimeframe } from 'jt-lib';

const timestamp = Date.now();
const roundedTime = roundTimeByTimeframe(timestamp, '1h');
// Округляет время до начала часа
```

## Обработка рыночных данных - как анализировать рынок

### CandlesBufferService - глобальное управление буферами

**`CandlesBufferService`** — глобальный сервис для управления буферами свечей. Сервис автоматически создается в `BaseScript` и доступен через `globals.candlesBufferService`.

```typescript
// Получение буфера через глобальный сервис
const buffer = await globals.candlesBufferService.getBuffer({
  symbol: 'BTC/USDT',
  timeframe: '1h',
  preloadCandlesCount: 500
});

// Сервис автоматически управляет кэшированием буферов
// Буферы создаются по ключу: `${symbol}-${timeframe}`
// При повторном запросе с теми же параметрами возвращается существующий буфер
```

### Интеграция с индикаторами

CandlesBuffer интегрируется с системой индикаторов:

```typescript
import { BaseIndicator } from 'jt-lib';

class MyIndicator extends BaseIndicator {
  constructor(symbol: string, timeframe: TimeFrame, buffer: CandlesBuffer) {
    super(symbol, timeframe, buffer);
  }

  calculate() {
    const candles = this.candlesBuffer.getCandles();
    // Логика расчета индикатора
  }
}
```

### Практические примеры анализа

#### Простой анализ тренда

```typescript
class Script extends BaseScript {
  private buffer: CandlesBuffer;

  async onInit() {
    // Получение буфера через глобальный сервис
    this.buffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '1h',
      preloadCandlesCount: 100
    });
  }

  async onTick() {
    const candles = this.buffer.getCandles();
    
    if (candles.length < 20) return;

    // Анализ тренда по последним 20 свечам
    const recentCandles = candles.slice(-20);
    const avgHigh = recentCandles.reduce((sum, c) => sum + c.high, 0) / 20;
    const avgLow = recentCandles.reduce((sum, c) => sum + c.low, 0) / 20;
    
    const currentPrice = this.buffer.close();
    
    if (currentPrice > avgHigh) {
      log('TrendAnalysis', 'Восходящий тренд', { currentPrice, avgHigh, avgLow }, true);
    } else if (currentPrice < avgLow) {
      log('TrendAnalysis', 'Нисходящий тренд', { currentPrice, avgHigh, avgLow }, true);
    } else {
      log('TrendAnalysis', 'Боковое движение', { currentPrice, avgHigh, avgLow }, true);
    }
  }
}
```

#### Анализ волатильности

```typescript
class Script extends BaseScript {
  private buffer: CandlesBuffer;

  async onInit() {
    // Получение буфера через глобальный сервис
    this.buffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '4h',
      preloadCandlesCount: 50
    });
  }

  async onTick() {
    const candles = this.buffer.getCandles();
    
    if (candles.length < 10) return;

    // Расчет волатильности
    const recentCandles = candles.slice(-10);
    const volatilities = recentCandles.map(candle => 
      (candle.high - candle.low) / candle.close
    );
    
    const avgVolatility = volatilities.reduce((sum, v) => sum + v, 0) / 10;
    
    log('VolatilityAnalysis', `Средняя волатильность: ${(avgVolatility * 100).toFixed(2)}%`, { avgVolatility }, true);
    
    if (avgVolatility > 0.05) {
      log('VolatilityAnalysis', 'Высокая волатильность', { avgVolatility }, true);
    } else if (avgVolatility < 0.02) {
      log('VolatilityAnalysis', 'Низкая волатильность', { avgVolatility }, true);
    }
  }
}
```

#### Поддержка и сопротивление

```typescript
class Script extends BaseScript {
  private buffer: CandlesBuffer;

  async onInit() {
    // Получение буфера через глобальный сервис
    this.buffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '1d',
      preloadCandlesCount: 100
    });
  }

  async onTick() {
    const candles = this.buffer.getCandles();
    
    if (candles.length < 50) return;

    // Поиск уровней поддержки и сопротивления
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    
    const resistance = Math.max(...highs.slice(-20));
    const support = Math.min(...lows.slice(-20));
    
    const currentPrice = this.buffer.close();
    
    log('SupportResistance', `Поддержка: ${support}, Сопротивление: ${resistance}`, { support, resistance, currentPrice }, true);
    
    if (currentPrice > resistance * 0.99) {
      log('SupportResistance', 'Пробой сопротивления', { currentPrice, resistance }, true);
    } else if (currentPrice < support * 1.01) {
      log('SupportResistance', 'Пробой поддержки', { currentPrice, support }, true);
    }
  }
}
```

### Оптимизация производительности

#### Управление размером буфера

```typescript
// Для долгосрочного анализа используйте большие буферы
const longTermBuffer = await globals.candlesBufferService.getBuffer({
  symbol: 'BTC/USDT',
  timeframe: '1d',
  preloadCandlesCount: 1000,
  maxBufferLength: 2000
});

// Для краткосрочного анализа - меньшие буферы
const shortTermBuffer = await globals.candlesBufferService.getBuffer({
  symbol: 'BTC/USDT',
  timeframe: '1m',
  preloadCandlesCount: 100,
  maxBufferLength: 500
});
```

#### Автоматическое кэширование буферов

```typescript
class Script extends BaseScript {
  private hourlyBuffer: CandlesBuffer;
  private dailyBuffer: CandlesBuffer;

  async onInit() {
    // Буферы автоматически кэшируются через глобальный сервис
    // При повторном запросе с теми же параметрами вернется существующий буфер
    this.hourlyBuffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '1h'
    });
    
    this.dailyBuffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '1d'
    });
  }
}
```

## Интеграция с другими компонентами

### BaseScript + CandlesBuffer

```typescript
class Script extends BaseScript {
  private buffer: CandlesBuffer;

  async onInit() {
    // Получение буфера через глобальный сервис
    this.buffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: getArgString('timeframe', '1h'),
      preloadCandlesCount: getArgNumber('candlesCount', 250)
    });
  }

  async onTick() {
    // Анализ рыночных данных
    const trend = this.analyzeTrend();
    const volatility = this.calculateVolatility();
    
    // Принятие торговых решений на основе анализа
    if (trend === 'bullish' && volatility < 0.03) {
      // Логика покупки
    }
  }
}
```

### OrdersBasket + Market Data

```typescript
class Script extends BaseScript {
  private basket: OrdersBasket;
  private buffer: CandlesBuffer;

  async onInit() {
    this.basket = new OrdersBasket({
      symbol: this.symbols[0],
      connectionName: this.connectionName
    });
    await this.basket.init();
    
    // Получение буфера через глобальный сервис
    this.buffer = await globals.candlesBufferService.getBuffer({
      symbol: this.symbols[0],
      timeframe: '1h'
    });
  }

  async onTick() {
    const currentPrice = this.basket.close();
    const bufferPrice = this.buffer.close();
    
    // Сравнение данных из разных источников
    if (Math.abs(currentPrice - bufferPrice) > currentPrice * 0.001) {
      warning('PriceValidation', 'Расхождение в ценах между источниками', { currentPrice, bufferPrice, difference: Math.abs(currentPrice - bufferPrice) });
    }
  }
}
```

## Следующие шаги

- **[Торговые скрипты](/docs/jt-lib/trading-scripts)** - Базовый класс для торговых скриптов
- **[Работа с биржей](/docs/jt-lib/exchange-orders-basket)** - OrdersBasket для торговых операций
- **[Система событий](/docs/jt-lib/events-system)** - EventEmitter для управления событиями
