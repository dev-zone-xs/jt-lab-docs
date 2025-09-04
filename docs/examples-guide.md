# Примеры jt-lib

Примеры использования библиотеки jt-lib с описанием функциональности и используемых классов.

## Список примеров

### Gainers & Losers Example

**Файл:** [Gainers-Losers-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/Gainers-Losers-Example.ts)

**Описание:** Сканирует USDT-своп рынки и находит символы с сильными дневными движениями (>30%).

**Используемые классы:**
- [BaseScript](jt-lib/060-trading-scripts.md) - базовый класс для торговых скриптов
- [StandardReportLayout](jt-lib/110-reporting-system.md) - система отчетов
- [BaseError](jt-lib/040-core-fundamentals.md) - обработка ошибок

**Функциональность:**
- Анализ исторических данных свечей
- Расчет процентных движений цены
- Создание таблиц отчетов с результатами

### Grid Bot Example

**Файл:** [GridBot-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/GridBot-Example.ts)

**Описание:** Многомонетная сеточная стратегия с автоматическим управлением позициями.

**Используемые классы:**
- [BaseScript](jt-lib/060-trading-scripts.md) - базовый класс для торговых скриптов
- [OrdersBasket](jt-lib/070-exchange-orders-basket.md) - управление ордерами и позициями
- [StandardReportLayout](jt-lib/110-reporting-system.md) - система отчетов

**Функциональность:**
- Создание сетки лимитных ордеров
- Автоматическое управление позициями
- Многомонетная торговля

### Indicators Example

**Файл:** [Indicators-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/Indicators-Example.ts)

**Описание:** Демонстрация работы с техническими индикаторами (SMA, ATR).

**Используемые классы:**
- [BaseScript](jt-lib/060-trading-scripts.md) - базовый класс для торговых скриптов
- [SimpleMovingAverageIndicator](jt-lib/100-technical-indicators.md) - индикатор SMA
- [AverageTrueRange](jt-lib/100-technical-indicators.md) - индикатор ATR
- [CandlesBuffer](jt-lib/090-market-data-candles.md) - буфер свечей
- [StandardReportLayout](jt-lib/110-reporting-system.md) - система отчетов

**Функциональность:**
- Создание и инициализация индикаторов
- Отображение данных в реальном времени
- Работа с историческими данными

### RSI Bot Example

**Файл:** [RsiBot-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/RsiBot-Example.ts)

**Описание:** Торговая стратегия на основе RSI индикатора с автоматическими сигналами.

**Используемые классы:**
- [BaseScript](jt-lib/060-trading-scripts.md) - базовый класс для торговых скриптов
- [OrdersBasket](jt-lib/070-exchange-orders-basket.md) - управление ордерами и позициями
- [RelativeStrengthIndex](jt-lib/100-technical-indicators.md) - RSI индикатор
- [StandardReportLayout](jt-lib/110-reporting-system.md) - система отчетов

**Функциональность:**
- Анализ RSI сигналов (покупка при RSI < 30, продажа при RSI > 70)
- Автоматическое управление позициями
- Стоп-лосс и тейк-профит ордера

### Trading API Example

**Файл:** [Trading-Api-Example.ts](https://github.com/jt-lab-com/jt-lib/blob/main/src/examples/Trading-Api-Example.ts)

**Описание:** Демонстрация торгового API с callback-функциями и кнопками действий.

**Используемые классы:**
- [BaseScript](jt-lib/060-trading-scripts.md) - базовый класс для торговых скриптов
- [OrdersBasket](jt-lib/070-exchange-orders-basket.md) - управление ордерами и позициями
- [StandardReportLayout](jt-lib/110-reporting-system.md) - система отчетов

**Функциональность:**
- Интерактивные кнопки для торговых операций
- Получение рыночных данных и информации об аккаунте
- Создание, модификация и отмена ордеров
- Callback-функции для обработки действий

## 🔗 Официальные ресурсы

- **🌐 [Официальный сайт JT-Lab](https://jt-lab.com)** - Главная страница платформы
- **📦 [JT-Trader на GitHub](https://github.com/jt-lab-com/jt-trader)** - Исходный код торговой платформы
- **📚 [JT-Lib на GitHub](https://github.com/jt-lab-com/jt-lib)** - Исходный код библиотеки для разработки
- **📖 [Полная документация](/docs/intro)** - Подробные руководства по всем компонентам
- **🚀 [Быстрый старт](/docs/quick-start)** - Начните работу за 5 минут
