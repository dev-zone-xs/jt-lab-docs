# Image Preview Plugin - Быстрый старт

## 🚀 Быстрое включение

### 1. Включить плагин
В файле `src/theme/Layout/index.tsx`:
```tsx
<ImagePreview enableLogs={false} />
```

### 2. Включить с логами (для отладки)
```tsx
<ImagePreview enableLogs={true} />
```

## 🚫 Быстрое отключение

### 1. Полное отключение
В файле `src/theme/Layout/index.tsx`:
```tsx
{/* <ImagePreview enableLogs={false} /> */}
```

### 2. Условное отключение (только в продакшене)
```tsx
{process.env.NODE_ENV === 'development' && <ImagePreview enableLogs={false} />}
```

## ⚙️ Настройки

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `enableLogs` | `boolean` | `false` | Включить логи в консоль для отладки |

## 🎯 Как использовать в Markdown

```markdown
<!-- Простые миниатюры с ссылками -->
[![Миниатюра](./images/thumb.png)](./images/full.png)

<!-- Три изображения в ряд -->
[![Изображение 1](./images/thumb1.png)](./images/full1.png) 
[![Изображение 2](./images/thumb2.png)](./images/full2.png) 
[![Изображение 3](./images/thumb3.png)](./images/full3.png)
```

## 🔧 Отладка

1. **Включите логи**: `<ImagePreview enableLogs={true} />`
2. **Откройте консоль браузера** (F12)
3. **Кликните на изображение**
4. **Смотрите логи** в консоли

## 📋 Поддерживаемые форматы

- PNG, JPG, JPEG
- GIF, WebP
- SVG, BMP

## 🎨 Кастомизация

Добавьте в `src/css/custom.css`:
```css
/* Изменить цвет фона */
#image-preview-modal {
  background-color: rgba(0, 0, 0, 0.8) !important;
}

/* Изменить стиль кнопки закрытия */
.modal-close {
  color: #ff0000 !important;
}
```

## ❓ Частые проблемы

**Плагин не работает?**
- Проверьте, что ссылка имеет `target="_blank"`
- Включите логи для отладки
- Убедитесь, что URL содержит расширение изображения

**Модальное окно не открывается?**
- Проверьте консоль на ошибки
- Убедитесь, что ссылка содержит изображение внутри

**Стили не применяются?**
- Используйте `!important` в CSS
- Проверьте z-index модального окна
