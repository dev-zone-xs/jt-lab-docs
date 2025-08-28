---
id: example
title: Example Page
sidebar_label: Example
---

<style>
{`
.real-size-img {
  width: auto !important;
  height: auto !important;
  max-width: none !important;
}

.image-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0;
}

.image-card {
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px 0;
}
`}
</style>

# Example Page

Это пример страницы с изображением для демонстрации возможностей Docusaurus.

## Пример изображения

Вот загруженное изображение, которое можно увеличить:

![Тестовое изображение](./images/test.png)

**Примечание:** Нажмите на изображение выше, чтобы увеличить его.

## Простые изображения в ряд (Markdown)

Вот три изображения в ряд с помощью простого Markdown:

![Изображение 1](./images/test.png) ![Изображение 2](./images/test.png) ![Изображение 3](./images/test.png)

**Примечание:** Каждое изображение можно увеличить, кликнув на него!

## Как это работает

1. Изображение помещено в папку `docs/images/`
2. Ссылка на изображение: `./images/test.png`
3. Docusaurus автоматически делает изображения кликабельными
4. При клике изображение открывается в полном размере

## Другие форматы

Вы также можете использовать другие форматы изображений:

- PNG: `![Описание](./images/image.png)`
- JPG: `![Описание](./images/image.jpg)`
- GIF: `![Описание](./images/image.gif)`
- SVG: `![Описание](./images/image.svg)`

## Размеры изображений

Можно указать размеры изображения:

```markdown
<img src="./images/test.png" alt="Описание" width="300" height="200" />
```

Или использовать HTML с кастомными стилями:

```html
<img src="./images/test.png" alt="Описание" style="max-width: 100%; height: auto;" />
```

## Три изображения подряд

Вот пример с тремя изображениями, расположенными в ряд:

### Простой Markdown вариант 111:

![Изображение 1](./images/test.png) ![Изображение 2](./images/test.png) ![Изображение 3](./images/test.png)

**Примечание:** Каждое изображение можно увеличить, кликнув на него!

### С подписями (Markdown):

![Торговый график](./images/test.png)
*Торговый график*

![Индикаторы](./images/test.png)
*Индикаторы*

![Аналитика](./images/test.png)
*Аналитика*

### С подписями (HTML figure):

<figure>
  <img src="./images/test.png" alt="Торговый график" width="300" />
  <figcaption>Торговый график с индикаторами</figcaption>
</figure>

<figure>
  <img src="./images/test.png" alt="Индикаторы" width="300" />
  <figcaption>Технические индикаторы</figcaption>
</figure>

<figure>
  <img src="./images/test.png" alt="Аналитика" width="300" />
  <figcaption>Анализ рынка</figcaption>
</figure>

## Рабочие примеры

### 1. Простые изображения в ряд (Markdown)

Вот как это выглядит в Markdown:

![Изображение 1](./images/test.png) ![Изображение 2](./images/test.png) ![Изображение 3](./images/test.png)

### 2. Изображения с подписями (Markdown)

![Торговый график](./images/test.png)
*Торговый график*

![Индикаторы](./images/test.png)
*Индикаторы*

![Аналитика](./images/test.png)
*Аналитика*

### 3. Сетка изображений (Markdown)

![Сетка 1](./images/test.png) ![Сетка 2](./images/test.png) ![Сетка 3](./images/test.png)

### 4. Адаптивная галерея (Markdown)

![Галерея 1](./images/test.png) ![Галерея 2](./images/test.png) ![Галерея 3](./images/test.png)

### 5. Изображения в столбец

![Изображение 1](./images/test.png)

![Изображение 2](./images/test.png)

![Изображение 3](./images/test.png)

### 6. HTML с div оберткой

<div>
  <figure>
    <img src="./images/test.png" alt="Изображение 1" width="300" />
    <figcaption>Описание изображения 1</figcaption>
  </figure>
</div>

<div>
  <figure>
    <img src="./images/test.png" alt="Изображение 2" width="300" />
    <figcaption>Описание изображения 2</figcaption>
  </figure>
</div>

<div>
  <figure>
    <img src="./images/test.png" alt="Изображение 3" width="300" />
    <figcaption>Описание изображения 3</figcaption>
  </figure>
</div>

### Код для трех изображений в ряд

#### Простой Markdown (рекомендуется):

```markdown
![Изображение 1](./images/test.png) ![Изображение 2](./images/test.png) ![Изображение 3](./images/test.png)
```

#### С подписями:

```markdown
![Изображение 1](./images/test.png)
*Описание изображения 1*

![Изображение 2](./images/test.png)
*Описание изображения 2*

![Изображение 3](./images/test.png)
*Описание изображения 3*
```

#### В столбец:

```markdown
![Изображение 1](./images/test.png)

![Изображение 2](./images/test.png)

![Изображение 3](./images/test.png)
```

#### HTML вариант (если нужен):
<img src="./images/test.png" alt="Изображение 1" />
<img src="./images/test.png" alt="Изображение 2" />
<img src="./images/test.png" alt="Изображение 3" />

```html
<img src="./images/test.png" alt="Изображение 1" />
<img src="./images/test.png" alt="Изображение 2" />
<img src="./images/test.png" alt="Изображение 3" />
```

#### HTML с figure и figcaption:

```html
<figure>
  <img src="./images/test.png" alt="Описание" width="300" />
  <figcaption>Подпись к изображению</figcaption>
</figure>
```

#### HTML с div оберткой:

```html
<div>
  <figure>
    <img src="./images/test.png" alt="Описание" width="300" />
    <figcaption>Подпись к изображению</figcaption>
  </figure>
</div>
```

## Примечание о размерах

**Markdown изображения** автоматически масштабируются под ширину контейнера, но сохраняют пропорции.

**HTML изображения** отображаются в оригинальном размере, если не указаны стили.

**Docusaurus** автоматически делает все изображения кликабельными для увеличения!
