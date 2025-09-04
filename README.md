# JT-Lib & JT-Trader Documentation

Документация для JavaScript Trading Libraries, построенная на [Docusaurus](https://docusaurus.io/).

## 🚀 Быстрый старт

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

## 📦 Зависимости

- **@docusaurus/core** - Ядро Docusaurus
- **@docusaurus/preset-classic** - Классический пресет
- **@mdx-js/react** - Поддержка MDX
- **remark-gfm** - GitHub Flavored Markdown
- **remark-images** - Обработка изображений

## 🔗 Полезные ссылки

### JT-Lab Ресурсы
- **🌐 [Официальный сайт JT-Lab](https://jt-lab.com)** - Главная страница платформы
- **📦 [JT-Trader на GitHub](https://github.com/jt-lab-com/jt-trader)** - Исходный код торговой платформы
- **📚 [JT-Lib на GitHub](https://github.com/jt-lab-com/jt-lib)** - Исходный код библиотеки для разработки

### Документация
- [Docusaurus Documentation](https://docusaurus.io/docs)
- [MDX Documentation](https://mdxjs.com/)
- [GitHub Pages](https://pages.github.com/)
