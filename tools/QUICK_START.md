# 🚀 Быстрый старт - Генератор миниатюр (Sharp)

## Установка Sharp

Sharp уже включен в зависимости проекта! Просто установите зависимости:

```bash
npm install
```

## Запуск

```bash
# Базовый запуск
npm run thumbnails

# С подробными логами
npm run thumbnails:debug

# Кастомные настройки
npm run thumbnails:custom
```

## Результат

- ✅ Миниатюры создаются в `static/images/thumbnails/`
- 📝 Логи сохраняются в `tools/logs/`
- 📊 Статистика в `tools/logs/last-run-stats.json`
- 🏷️ **Новое именование:** `image.jpg` → `image-thumb.jpg`

## Особенности Sharp

- ⚡ **Быстрее** ImageMagick в 3-5 раз
- 🎯 **Лучшее качество** изображений
- 📦 **Простая установка** - только npm install
- 🖼️ **Больше форматов** - JPG, PNG, GIF, WebP, TIFF, BMP

## Подробная документация

См. [README.md](README.md) для полной документации.