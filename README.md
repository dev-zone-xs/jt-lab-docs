# JT-Lib & JT-Trader Documentation

Документация для JavaScript Trading Libraries, построенная на [Docusaurus](https://docusaurus.io/).

## 🚀 Быстрый старт

**🌐 Онлайн документация:** [https://dev-zone-xs.github.io/jt-lab-docs/](https://dev-zone-xs.github.io/jt-lab-docs/)

> **Второй тест защиты ветки main** - проверяем обновленные правила GitHub

### Установка зависимостей
```bash
yarn install
```

### Разработка
```bash
yarn start
```
Сайт будет доступен по адресу: http://localhost:3000

### Сборка для продакшена
```bash
yarn build
```

### Тестирование сборки
```bash
yarn serve
```

## 📚 Структура документации

- **JT-Lib** - Основная библиотека для алгоритмической торговли
- **JT-Trader** - Высокоуровневый фреймворк для торговли
- **Triggers** - Система триггеров для автоматизации
- **Interfaces** - TypeScript интерфейсы и типы

## 🌐 Деплой на GitHub Pages

Сайт автоматически деплоится на GitHub Pages при пуше в ветку `main`.

### Настройка GitHub Pages

1. Перейдите в настройки репозитория на GitHub
2. В разделе "Pages" выберите источник "GitHub Actions"
3. При каждом пуше в `main` сайт будет автоматически обновляться

## 🔧 Конфигурация

- `docusaurus.config.ts` - основная конфигурация Docusaurus
- `sidebars.ts` - структура навигации
- `src/css/custom.css` - пользовательские стили

## 📝 Добавление новой документации

1. Создайте `.md` файл в соответствующей папке
2. Добавьте frontmatter с `id`, `title`, `sidebar_label`
3. Обновите `sidebars.ts` для добавления в навигацию
4. Запустите `yarn start` для проверки

## 🐛 Устранение неполадок

### Ошибки сборки
- Проверьте все ссылки в документации
- Убедитесь, что все файлы существуют
- Проверьте синтаксис Markdown

### Проблемы с изображениями
- Используйте относительные пути: `./images/example.png`
- Добавьте атрибуты `width` и `height` для контроля размера
- Изображения автоматически увеличиваются при клике

## 🖼️ Система превью изображений

Документация включает в себя **кастомную систему превью изображений**, которая автоматически перехватывает клики по ссылкам на изображения и показывает их в полноэкранном модальном окне.

### Как это работает

1. **Автоматическое определение**: Скрипт автоматически находит все ссылки с `target="_blank"`, которые ведут на изображения
2. **Поддерживаемые форматы**: jpg, jpeg, png, gif, webp, svg, bmp
3. **Модальное окно**: При клике на изображение открывается полноэкранное модальное окно
4. **Управление**: Закрытие по клику на overlay, кнопке закрытия или клавише Escape

### Техническая реализация

#### React компонент (`src/components/ImagePreview.tsx`)
```typescript
interface ImagePreviewProps {
  enableLogs?: boolean; // Включить отладочные логи
}

<ImagePreview enableLogs={false} />
```

#### Standalone JavaScript (`src/js/image-preview.js`)
Чистый JavaScript файл, который можно использовать независимо от React. 

#### Интеграция в Layout (`src/theme/Layout/index.tsx`)
```typescript
import ImagePreview from '../../components/ImagePreview';

export default function LayoutWrapper(props: Props): ReactNode {
  return (
    <>
      <Layout {...props} />
      <ImagePreview enableLogs={false} />
    </>
  );
}
```

### Функциональность

✅ **Полноэкранный просмотр** - изображения отображаются в модальном окне  
✅ **Адаптивный дизайн** - корректная работа на мобильных устройствах  
✅ **Анимации** - плавные переходы при открытии/закрытии  
✅ **Подписи** - отображение alt-текста изображения  
✅ **Блокировка скролла** - предотвращение прокрутки страницы при открытом модальном окне  
✅ **Множественные способы закрытия** - клик по overlay, кнопка ×, клавиша Escape  

### Настройка

Для включения отладочных логов установите `enableLogs={true}`:

```typescript
<ImagePreview enableLogs={true} />
```

Это выведет в консоль подробную информацию о работе скрипта, что полезно для отладки.

## 📦 Зависимости

- **@docusaurus/core** - Ядро Docusaurus
- **@docusaurus/preset-classic** - Классический пресет
- **@mdx-js/react** - Поддержка MDX
- **remark-gfm** - GitHub Flavored Markdown
- **remark-images** - Обработка изображений

## 🔗 Полезные ссылки

### Документация
- **📖 [Онлайн документация](https://dev-zone-xs.github.io/jt-lab-docs/)** - Полная документация JT-Lib и JT-Trader
- **📚 [JT-Lib документация](https://dev-zone-xs.github.io/jt-lab-docs/docs/jt-lib/)** - Документация основной библиотеки
- **⚙️ [JT-Trader документация](https://dev-zone-xs.github.io/jt-lab-docs/docs/jt-trader/)** - Документация торговой платформы

### JT-Lab Ресурсы
- **🌐 [Официальный сайт JT-Lab](https://jt-lab.com)** - Главная страница платформы
- **📦 [JT-Trader на GitHub](https://github.com/jt-lab-com/jt-trader)** - Исходный код торговой платформы
- **📚 [JT-Lib на GitHub](https://github.com/jt-lab-com/jt-lib)** - Исходный код библиотеки для разработки

### Документация
- [Docusaurus Documentation](https://docusaurus.io/docs)
- [MDX Documentation](https://mdxjs.com/)
- [GitHub Pages](https://pages.github.com/)
