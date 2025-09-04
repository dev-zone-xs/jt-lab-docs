# Image Preview Plugin

Плагин для предварительного просмотра изображений в Docusaurus. Автоматически перехватывает клики по ссылкам изображений и открывает их в красивом модальном окне вместо перехода по ссылке.

## 🚀 Возможности

- **Автоматический перехват** кликов по ссылкам изображений
- **Красивое модальное окно** с анимациями
- **Адаптивный дизайн** для мобильных устройств
- **Закрытие** по клику на фон, крестик или клавишу Escape
- **Блокировка скролла** страницы при открытом модальном окне
- **Поддержка всех форматов** изображений (PNG, JPG, GIF, SVG, WebP, BMP)
- **Опциональные логи** для отладки

## 📦 Установка

### 1. Создание компонента

Создайте файл `src/components/ImagePreview.tsx`:

```tsx
import React, { useEffect } from 'react';

interface ImagePreviewProps {
  enableLogs?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ enableLogs = false }) => {
  // ... код компонента (см. полный код в src/components/ImagePreview.tsx)
};

export default ImagePreview;
```

### 2. Интеграция в Layout

Обновите файл `src/theme/Layout/index.tsx`:

```tsx
import React, {type ReactNode} from 'react';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type {WrapperProps} from '@docusaurus/types';
import ImagePreview from '../../components/ImagePreview';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  return (
    <>
      <Layout {...props} />
      <ImagePreview enableLogs={false} />
    </>
  );
}
```

## ⚙️ Конфигурация

### Включение/отключение логов

```tsx
// Включить логи для отладки
<ImagePreview enableLogs={true} />

// Отключить логи (по умолчанию)
<ImagePreview enableLogs={false} />
```

### Условное включение логов

```tsx
// Включить логи только в режиме разработки
<ImagePreview enableLogs={process.env.NODE_ENV === 'development'} />
```

## 🎯 Как это работает

### Автоматическое определение изображений

Плагин автоматически определяет ссылки на изображения по:
- **Расширению файла**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.bmp`
- **Атрибуту target**: `target="_blank"`
- **Наличию изображения** внутри ссылки

### Поддерживаемые форматы Markdown

```markdown
<!-- Простые ссылки с изображениями -->
[![Описание](./images/image.png)](./images/image.png)

<!-- С target="_blank" -->
[![Описание](./images/image.png)](./images/image.png){target="_blank"}

<!-- HTML ссылки -->
<a href="./images/image.png" target="_blank">
  <img src="./images/thumb.png" alt="Описание" />
</a>
```

## 🎨 Кастомизация стилей

Плагин добавляет CSS стили автоматически. Для кастомизации вы можете:

### 1. Переопределить стили в custom.css

```css
/* src/css/custom.css */

/* Изменить цвет фона модального окна */
#image-preview-modal {
  background-color: rgba(0, 0, 0, 0.8) !important;
}

/* Изменить стиль кнопки закрытия */
.modal-close {
  color: #ff0000 !important;
  font-size: 32px !important;
}

/* Изменить стиль контейнера */
.modal-content {
  border-radius: 12px !important;
  padding: 30px !important;
}
```

### 2. Изменить z-index

```css
#image-preview-modal {
  z-index: 9999 !important; /* По умолчанию 10000 */
}
```

## 🔧 Отладка

### Включение логов

```tsx
<ImagePreview enableLogs={true} />
```

### Логи в консоли

При включенных логах вы увидите:

```
🖼️ Image Preview: Компонент загружен, инициализируем JavaScript
🖼️ Image Preview: Инициализация начата
🖼️ Image Preview: Стили добавлены
🖼️ Image Preview: Модальное окно создано
🖼️ Image Preview: Инициализация завершена
```

При клике на изображение:

```
🖼️ Image Preview: Клик зарегистрирован
🖼️ Image Preview: Найдена ссылка
🖼️ Image Preview: Найдено изображение
🖼️ Image Preview: URL ссылки: /path/to/image.png
🖼️ Image Preview: Проверяем URL: /path/to/image.png
🖼️ Image Preview: Имеет расширение изображения: true
🖼️ Image Preview: Не HTML страница: true
🖼️ Image Preview: Итоговый результат: true
🖼️ Image Preview: Это изображение!
🖼️ Image Preview: Target ссылки: _blank
🖼️ Image Preview: Перехватываем клик и показываем модальное окно
🖼️ Image Preview: Показываем модальное окно
🖼️ Image Preview: Модальное окно показано
```

## 🚫 Отключение плагина

### Полное отключение

Удалите или закомментируйте компонент в Layout:

```tsx
export default function LayoutWrapper(props: Props): ReactNode {
  return (
    <>
      <Layout {...props} />
      {/* <ImagePreview enableLogs={false} /> */}
    </>
  );
}
```

### Условное отключение

```tsx
export default function LayoutWrapper(props: Props): ReactNode {
  const showImagePreview = process.env.NODE_ENV === 'production';
  
  return (
    <>
      <Layout {...props} />
      {showImagePreview && <ImagePreview enableLogs={false} />}
    </>
  );
}
```

## 🐛 Устранение неполадок

### Плагин не работает

1. **Проверьте консоль браузера** на наличие ошибок
2. **Включите логи** для отладки: `<ImagePreview enableLogs={true} />`
3. **Убедитесь**, что ссылки имеют `target="_blank"`
4. **Проверьте**, что URL содержит расширение изображения

### Модальное окно не открывается

1. **Проверьте логи** в консоли
2. **Убедитесь**, что ссылка содержит изображение
3. **Проверьте**, что URL является изображением

### Стили не применяются

1. **Проверьте**, что компонент загружается
2. **Используйте !important** в кастомных стилях
3. **Проверьте z-index** модального окна

## 📝 Примеры использования

### Базовое использование

```markdown
# Галерея изображений

[![Изображение 1](./images/thumb1.png)](./images/full1.png)
[![Изображение 2](./images/thumb2.png)](./images/full2.png)
[![Изображение 3](./images/thumb3.png)](./images/full3.png)
```

### С подписями

```markdown
[![Скриншот интерфейса](./images/interface-thumb.png)](./images/interface-full.png)
*Скриншот главного интерфейса приложения*

[![Диаграмма архитектуры](./images/arch-thumb.png)](./images/arch-full.png)
*Диаграмма архитектуры системы*
```

### HTML с атрибутами

```html
<a href="./images/demo.png" target="_blank">
  <img src="./images/demo-thumb.png" alt="Демонстрация" width="200" height="150" />
</a>
```

## 🔄 Обновления

При обновлении плагина:

1. **Обновите компонент** `ImagePreview.tsx`
2. **Перезапустите сервер** разработки
3. **Проверьте работу** на тестовых изображениях

## 📄 Лицензия

Этот плагин является частью проекта JT-Lib Documentation и распространяется под той же лицензией.
