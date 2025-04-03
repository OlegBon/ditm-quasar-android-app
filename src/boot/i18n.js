import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  // Отримуємо мову браузера для першого запуску
  const browserLocale = navigator.language || 'uk-UA' // Якщо браузер не повертає значення, встановлюємо 'uk-UA'

  // Отримуємо збережену локаль із localStorage (якщо вона є)
  const savedLocale = localStorage.getItem('locale')

  // Список доступних локалей
  const availableLocales = Object.keys(messages)

  // Встановлюємо локаль у такому пріоритеті: збережена локаль > мова браузера > дефолтна локаль ('uk-UA')
  const locale =
    savedLocale && availableLocales.includes(savedLocale)
      ? savedLocale
      : availableLocales.includes(browserLocale)
        ? browserLocale
        : 'uk-UA'

  // Якщо локаль визначена при першому зверненні, зберігаємо її в localStorage
  localStorage.setItem('locale', locale)

  // Ініціалізуємо i18n з вибраною локалізацією
  const i18n = createI18n({
    locale, // Встановлюємо локаль
    globalInjection: true,
    messages,
  })

  // Підключаємо i18n до додатку
  app.use(i18n)
})
