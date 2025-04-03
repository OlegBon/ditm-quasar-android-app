<template>
  <div class="language-menu" @click.stop>
    <!-- Поточна мова у кнопці -->
    <button @click="toggleDropdown">
      {{ currentLanguage }}
    </button>

    <!-- Випадаюче меню з двома іншими мовами -->
    <ul v-if="isDropdownOpen" class="lang-dropdown-menu" @click.stop>
      <li v-for="lang in otherLanguages" :key="lang.code" @click="switchLanguage(lang.code)">
        {{ lang.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDropdownOpen: false,
      languages: [
        { code: 'uk-UA', name: 'UK' },
        { code: 'en-US', name: 'EN' },
        { code: 'ru-RU', name: 'RU' },
      ],
    }
  },
  computed: {
    currentLanguage() {
      return this.languages.find((lang) => lang.code === this.$i18n.locale).name
    },
    otherLanguages() {
      // Повертає всі мови, окрім поточної
      return this.languages.filter((lang) => lang.code !== this.$i18n.locale)
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    switchLanguage(langCode) {
      this.$i18n.locale = langCode
      localStorage.setItem('locale', langCode) // Збереження мови в localStorage
      this.isDropdownOpen = false
    },
  },
  created() {
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale) {
      this.$i18n.locale = savedLocale // Встановлення локалі при завантаженні сторінки
    }
  },
}
</script>
