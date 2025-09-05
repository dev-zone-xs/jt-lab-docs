# Инструкция по разворачиванию JT-Lab Docs

## Локальная разработка

### Требования
- Node.js версии 18 или выше
- Yarn пакетный менеджер

### Установка зависимостей
```bash
yarn install
```

### Запуск сервера разработки
```bash
yarn start
```

Сайт будет доступен по адресу: http://localhost:3000/jt-lab-docs/

### Сборка для продакшена
```bash
yarn build
```

Собранные файлы будут находиться в папке `build/`

### Предварительный просмотр собранного сайта
```bash
yarn serve
```

## Публикация на GitHub Pages

### Автоматическая публикация

Проект настроен для автоматической публикации на GitHub Pages через GitHub Actions.

**Что происходит автоматически:**
1. При каждом push в ветку `main` запускается GitHub Action
2. Собирается статическая версия сайта
3. Публикуется на GitHub Pages

**Для публикации:**
1. Убедитесь, что все изменения зафиксированы в ветке `am-fix`
2. Переключитесь на ветку `main`:
   ```bash
   git checkout main
   ```
3. Слейте изменения:
   ```bash
   git merge am-fix
   ```
4. Отправьте изменения в удаленный репозиторий:
   ```bash
   git push origin main
   ```

**Настройка GitHub Pages:**
1. Перейдите в Settings репозитория на GitHub
2. В разделе "Pages" выберите:
   - Source: "GitHub Actions"
   - Workflow: "Deploy to GitHub Pages"

### Ручная публикация (альтернативный способ)

Если автоматическая публикация не работает, можно опубликовать вручную:

1. Соберите проект:
   ```bash
   yarn build
   ```

2. Создайте ветку `gh-pages`:
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   ```

3. Скопируйте собранные файлы:
   ```bash
   cp -r build/* .
   ```

4. Создайте файл `.nojekyll`:
   ```bash
   touch .nojekyll
   ```

5. Зафиксируйте изменения:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

## Структура проекта

```
jt-lab-docs/
├── docs/                    # Документация
│   ├── jt-lib/             # Документация по JT-Lib
│   └── jt-trader/          # Документация по JT-Trader
├── blog/                   # Блог
├── src/                    # Исходный код React компонентов
├── static/                 # Статические файлы
├── .github/workflows/      # GitHub Actions
├── docusaurus.config.ts    # Конфигурация Docusaurus
├── sidebars.ts            # Настройка боковой панели
└── package.json           # Зависимости проекта
```

## Настройка конфигурации

### Основные настройки в `docusaurus.config.ts`:
- `baseUrl` - базовый URL сайта
- `organizationName` - имя организации на GitHub
- `projectName` - имя проекта
- `deploymentBranch` - ветка для публикации (по умолчанию 'gh-pages')

### Настройка боковой панели в `sidebars.ts`:
- Определяет структуру навигации в документации
- Группирует документы по разделам

## Решение проблем

### Ошибки сборки
1. Убедитесь, что все зависимости установлены: `yarn install`
2. Очистите кэш: `yarn cache clean`
3. Удалите папку `build` и пересоберите: `rm -rf build && yarn build`

### Проблемы с GitHub Pages
1. Проверьте, что GitHub Actions включены в настройках репозитория
2. Убедитесь, что в настройках Pages выбран источник "GitHub Actions"
3. Проверьте логи в разделе "Actions" на GitHub

### Проблемы с локальным сервером
1. Убедитесь, что порт 3000 свободен
2. Попробуйте запустить на другом порту: `yarn start --port 3001`
3. Очистите кэш Docusaurus: `rm -rf .docusaurus`

## Полезные команды

```bash
# Установка зависимостей
yarn install

# Запуск сервера разработки
yarn start

# Сборка проекта
yarn build

# Предварительный просмотр сборки
yarn serve

# Очистка кэша
yarn cache clean

# Проверка типов TypeScript
yarn tsc --noEmit
```

## Контакты

При возникновении проблем с разворачиванием обращайтесь к команде разработки.
