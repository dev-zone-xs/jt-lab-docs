---
id: installation
title: Установка JT-LAB
sidebar_label: Установка системы
---

# Установка JT-Trader

Полное руководство по установке и настройке платформы JT-Trader для алгоритмической торговли.

<!-- TOC -->
* [Лицензия](#лицензия)
* [Системные требования](#системные-требования)
* [Способы установки](#способы-установки)
* [1. Установка через Launcher](#1-установка-через-launcher)
* [2. Установка через Docker](#2-установка-через-docker)
* [3. Прямая установка из GitHub](#3-прямая-установка-из-github)
* [Проверка установки](#проверка-установки)
* [Устранение неполадок](#устранение-неполадок)
<!-- TOC -->

## Лицензия

JT-LAB имеет двойную лицензию:

- 🟢 **Бесплатно** для личного, образовательного и open-source использования под лицензией [AGPLv3](LICENSE).
- 🔒 **Коммерческое использование** требует [платной лицензии](mailto:am@jt-lab.com).


___

## Системные требования

Для работы JT-LAB необходимы:

- **Node.js**: версия 18 
- **Git**: для клонирования репозитория
- **Yarn**: для управления зависимостями
- **Redis**: официально система может работать с файловым кэшем

## Способы установки

JT-Trader можно установить тремя способами в зависимости от ваших потребностей:

### 🚀 Launcher - для пользователей
Если вы просто хотите использовать JT-Trader для торговли и не планируете разрабатывать собственных роботов, то **Launcher** - это идеальный выбор. Он автоматически установит все необходимое и настроит систему за вас.

### 🐳 Docker - для серверных развертываний  
Если вы хотите развернуть JT-Trader на своем сервере или в облаке, то **Docker** - это удобный способ. Вы можете легко масштабировать систему и управлять несколькими экземплярами.

### 📦 GitHub - для разработчиков
Если вы планируете разрабатывать собственных торговых роботов или вносить изменения в код, то установка из **GitHub** даст вам полный контроль над исходным кодом и возможность кастомизации.

---

## 1. Установка через Launcher

**Launcher** - это самый простой способ установки JT-Trader. Он автоматически загружает все необходимые компоненты, настраивает окружение и запускает приложение. Идеально подходит для тех, кто хочет быстро начать работать с системой.

### Скачивание Launcher

Выберите версию для вашей операционной системы:

| Операционная система | Ссылка для скачивания |
|---------------------|----------------------|
| **Windows** | [JT-Trader-Launcher-Setup.exe](https://jt-launcher.fra1.cdn.digitaloceanspaces.com/releases/latest/JT-Trader-Launcher-Setup.exe) |
| **macOS (Intel)** | [JT-Trader-Launcher.dmg](https://jt-launcher.fra1.cdn.digitaloceanspaces.com/releases/latest/JT-Trader-Launcher.dmg) |
| **macOS (Apple Silicon)** | [JT-Trader-Launcher-arm64.dmg](https://jt-launcher.fra1.cdn.digitaloceanspaces.com/releases/latest/JT-Trader-Launcher-arm64.dmg) |

### Установка

1. **Скачайте** соответствующий файл для вашей ОС
2. **Запустите** установщик и следуйте инструкциям
3. **Дождитесь** завершения автоматической настройки
4. **Откройте** браузер и перейдите по адресу: `http://localhost:8080`

### Преимущества Launcher

- ✅ Автоматическая установка всех зависимостей
- ✅ Предварительная настройка окружения
- ✅ Автоматическое обновление
- ✅ Простой интерфейс управления
- ✅ Встроенная диагностика проблем

---

## 2. Установка через Docker

Docker обеспечивает изолированную среду для запуска JT-Trader без необходимости установки зависимостей на основную систему. Отлично подходит для развертывания на серверах и в облачных средах.

### Установка Docker

Скачайте и установите последнюю версию [Docker](https://www.docker.com/) для вашей операционной системы.

### Быстрая установка

#### Windows

1. Создайте рабочую директорию для приложения
2. Скачайте файл `setup-windows.bat` и поместите его в рабочую директорию
3. Запустите `setup-windows.bat`
4. После завершения установки откройте браузер и перейдите по адресу: `http://localhost:8080/`

#### Linux / macOS

1. Создайте рабочую директорию для приложения
2. Скачайте файл `setup.sh` и поместите его в рабочую директорию
3. Откройте терминал, перейдите в рабочую директорию и выполните:

```bash
bash setup.sh
```

4. После завершения установки откройте браузер и перейдите по адресу: `http://localhost:8080/`

---

## 3. Прямая установка из GitHub

Для разработчиков и продвинутых пользователей, которые хотят полный контроль над процессом установки. Этот способ необходим, если вы планируете разрабатывать собственных торговых роботов или модифицировать исходный код.

### Клонирование репозитория

Клонируйте репозиторий вместе с подмодулем [jt-lib](https://github.com/jt-lab-com/jt-lib):

```bash
git clone --recurse-submodules https://github.com/jt-lab-com/jt-trader.git
```

**Альтернативно:** Если у вас уже есть клонированный репозиторий без подмодулей:

```bash
git clone https://github.com/jt-lab-com/jt-trader.git
cd jt-trader
git submodule update --init --recursive
```

### Установка зависимостей

Перейдите в папку проекта и установите зависимости:

```bash
cd jt-trader && yarn
```

### Настройка окружения

Создайте файл `.env` в корневой директории проекта, скопировав содержимое `.env.example`, и укажите значения для следующих переменных окружения:


### Пример конфигурации .env

```env
# Основные настройки
PORT=8080
SITE_API_HOST=https://jt-lab.com
STANDALONE_APP=1

# Режим торгового движка: both, realtime, tester
ENGINE_MODE="both"

# Пути к файлам и директориям
DATABASE_URL="file:/path/to/your/project/storage.db"
ROLLUP_TS_CONFIG=tsconfig.bundler.json
STRATEGY_FILES_PATH=/path/to/your/project/strategy-source/src
MARKETS_FILE_PATH=markets.json
ARTIFACTS_DIR_PATH=/path/to/your/project/artifacts
HISTORY_BARS_PATH=downloaded-history-bars
LOGS_DIR_PATH=artifacts

# Redis (опционально - система может работать с файловым кэшем)
# REDIS_URL=redis://localhost:6379
```

### Описание переменных

| Переменная | Описание | Пример |
|------------|----------|---------|
| `PORT` | Порт, на котором будет запущено приложение | `8080` |
| `SITE_API_HOST` | Базовый URL API сайта | `https://jt-lab.com` |
| `STANDALONE_APP` | Локальный режим работы (1 = включен) | `1` |
| `ENGINE_MODE` | Режим торгового движка | `"both"`, `"realtime"`, `"tester"` |
| `DATABASE_URL` | **Абсолютный путь** к файлу базы данных SQLite | `"file:/path/to/your/project/storage.db"` |
| `STRATEGY_FILES_PATH` | **Абсолютный путь** к исходному коду стратегий | `/path/to/your/project/strategy-source/src` |
| `ROLLUP_TS_CONFIG` | Путь к конфигурации TypeScript | `tsconfig.bundler.json` |
| `MARKETS_FILE_PATH` | Путь к файлу конфигурации рынков | `markets.json` |
| `ARTIFACTS_DIR_PATH` | Путь к директории отчетов стратегий | `/path/to/your/project/artifacts` |
| `HISTORY_BARS_PATH` | Путь к директории исторических данных | `downloaded-history-bars` |
| `LOGS_DIR_PATH` | Путь к директории логов | `artifacts` |
| `REDIS_URL` | URL подключения к Redis (опционально) | `redis://localhost:6379` |

### ⚠️ Важно: Настройка путей

**Замените `/path/to/your/project/` на реальные пути к вашему проекту:**

- `DATABASE_URL` - укажите полный путь к файлу базы данных
- `STRATEGY_FILES_PATH` - укажите путь к папке с исходным кодом стратегий  
- `ARTIFACTS_DIR_PATH` - укажите путь к папке для отчетов и артефактов

**Пример для Windows:**
```env
DATABASE_URL="file:C:/Users/YourName/jt-trader/storage.db"
STRATEGY_FILES_PATH=C:/Users/YourName/jt-trader/strategy-source/src
ARTIFACTS_DIR_PATH=C:/Users/YourName/jt-trader/artifacts
```

**Пример для Linux/macOS:**
```env
DATABASE_URL="file:/home/username/jt-trader/storage.db"
STRATEGY_FILES_PATH=/home/username/jt-trader/strategy-source/src
ARTIFACTS_DIR_PATH=/home/username/jt-trader/artifacts
```

### Сборка и запуск

Для сборки проекта выполните:

```bash
yarn build:prod
```

Для запуска приложения в продакшн режиме:

```bash
yarn start:prod
```

---

## Проверка установки

1. **Откройте веб-интерфейс:**
   - Перейдите по адресу: `http://localhost:8080`
   - Убедитесь, что приложение загружается

2. **Проверьте JT-LIB:**
```bash
# Проверьте наличие папки jt-lib в проекте
ls -la jt-lib/
```

3. **Настройте подключения к биржам:**
   - Зайдите в веб-интерфейс
   - Перейдите в раздел "Connections"
   - Добавьте подключения к биржам

## Устранение неполадок

### Частые проблемы

#### Ошибка "Module not found"
```bash
# Переустановите зависимости
rm -rf node_modules
yarn install
```

#### Проблемы с портами
```bash
# Проверьте, какие порты заняты
netstat -tulpn | grep :8080
```

#### Проблемы с подключением к биржам
- Проверьте правильность API ключей
- Убедитесь, что IP адрес разрешен на бирже
- Проверьте интернет-соединение

## Следующие шаги

После успешной установки:

1. **[Настройка JT-Trader](/docs/jt-trader/configuration)** - Настройка платформы
2. **[Использование](/docs/jt-trader/usage)** - Изучение интерфейса
3. **[Создание стратегий](/docs/jt-lib/trading-scripts)** - Разработка торговых роботов
4. **[Тестирование](/docs/jt-trader/tester)** - Тестирование стратегий

---

## Полезные ссылки

- **GitHub репозиторий**: [https://github.com/jt-lab-com/jt-trader](https://github.com/jt-lab-com/jt-trader)
- **JT-Lib библиотека**: [https://github.com/jt-lab-com/jt-lib](https://github.com/jt-lab-com/jt-lib)
- **Официальный сайт**: [https://jt-lab.com](https://jt-lab.com)

---

**Поздравляем! Вы успешно установили JT-LAB. Теперь можете приступать к созданию торговых стратегий!** 🚀
