# Quasar App (quasar-project)

## Опис

Цей проект є роботою по курсу "Розробка мобільних додатків" (ДіТМ, Інженерія програмного забезпечення, III курс, II семестр). Він представляє собою демонстрацію базового функціоналу для створення мобільного додатку з використанням Quasar Framework.

## Функціонал

- Реєстрація користувачів
- Авторизація користувачів
- Вихід із системи
- Перегляд списку товарів
- Додавання товару у корзину
- Робота з корзиною
- Перегляд деталей товару
- Пошук товарів
- Фільтр по категоріям товарів

## Використані технології

- Quasar Framework
- Axios для HTTP-запитів
- Pinia для управління станом
- Capacitor для інтеграції з платформою Android
- DummyJSON (https://dummyjson.com/) для наповненя данними

## Вимоги до середовища

- Node.js 14.0+
- npm 6.0+
- Android Studio для збірки під Android
- Quasar CLI

## Інсталяція

1. Клонування репозиторію:
   ```sh
   git clone https://github.com/OlegBon/ditm-quasar-android-app
   ```
2. Перехід до директорії проекту:

   ```sh
   cd ditm-quasar-android-app
   ```

3. Встановлення залежностей:

   ```sh
   npm install
   ```

Якщо потрібно (Windows)

```sh
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## Запуск проекту

```bash
npx quasar dev
```

### Build проекту для Android Studio

```bash
quasar build -m capacitor -T android
```

### Створення нових page/layout

```bash
quasar new layout User
quasar new page Profile Posts
```

## Файлова структура

```text
quasar-project/
│
├── src/
│   ├── assets/
│   │   ├── about-us.jpg
│   │   ├── contacts-map.jpg
│   │   └── home-banner.jpg
│   ├── boot/
│   │   ├── .gitkeep
│   │   ├── axios.js
│   │   ├── i18n.js
│   │   └── store.js
│   ├── components/
│   │   ├── BackToTopButton.vue
│   │   └── EssentialLink.vue
│   ├── css/
│   │   ├── app.scss
│   │   └── quasar.variables.scss
│   ├── i18n/
│   ├── layouts/
│   │   ├── AboutLayout.vue
│   │   ├── CartLayout.vue
│   │   ├── ContactsLayout.vue
│   │   ├── DefaultLayout.vue
│   │   ├── LoginLayout.vue
│   │   ├── MainLayout.vue
│   │   ├── ProductDetailLayout.vue
│   │   ├── ProductsLayout.vue
│   │   ├── SidebarLayout.vue
│   │   └── UserLayout.vue
│   ├── pages/
│   │   ├── AboutPage.vue
│   │   ├── CartPage.vue
│   │   ├── ContactsPage.vue
│   │   ├── ErrorNotFound.vue
│   │   ├── IndexPage.vue
│   │   ├── LoginPage.vue
│   │   ├── ProductDetailPage.vue
│   │   ├── ProductsPage.vue
│   │   └── UserPage.vue
│   ├── router/
│   │   ├── index.js
│   │   └── routes.js
│   ├── store/
│   │   ├── cartStore.js
│   │   ├── index.js
│   │   └── userStore.js
│   ├── utils/
│   │   └── date.js
│   └── App.vue
│
├── src-capacitor/
│   ├── android/
│   └── www/
│
├── .editorconfig
├── .gitignore
├── .npmrc
├── .prettierrc.json
├── eslint.config.js
├── index.
├── LICENSE
├── package.json
├── postcss.config.js
├── quasar.config.js
└── README.md
```

## Структура проекту

Проект складається з основних директорій та файлів, що використовуються для налаштування та роботи додатку. У директорії src міститься код додатку, включаючи компоненти, сторінки, макети та інші важливі файли. Директорія src-capacitor містить файли, необхідні для інтеграції з платформою Android.

- `src/`: основна директорія проекту, що містить основний код додатку.
  - `assets/`: графічні та інші статичні ресурси.
  - `boot/`: файли конфігурації для ініціалізації додатку.
  - `components/`: багаторазові компоненти Vue.js.
  - `css/`: стилі додатку.
  - `i18n/`: файли для мультимовного інтерфейсу.
  - `layouts/`: макети для різних сторінок додатку.
  - `pages/`: сторінки додатку.
  - `router/`: налаштування маршрутизації для додатку.
  - `store/`: файли для управління станом додатку (Pinia).
  - `utils/`: утилітарні функції.
- `src-capacitor/`: файли для інтеграції з платформою Android.
- Кореневі файли конфігурації: .editorconfig, .gitignore, .npmrc, .prettierrc.json, eslint.config.js, quasar.config.js, тощо.

## Автори

- [Oleg Bon](https://github.com/OlegBon)

## Ліцензія

Цей проект ліцензовано відповідно до ліцензії MIT. Див. файл [LICENSE](./LICENSE) для деталей.
