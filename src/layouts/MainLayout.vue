<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Shop App </q-toolbar-title>

        <div>{{ currentDate }}</div>

        <LanguageSwitcher />
      </q-toolbar>
    </q-header>

    <Sidebar v-model:open="leftDrawerOpen" />

    <q-page-container>
      <router-view />
      <BackToTopButton />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import Sidebar from './SidebarLayout.vue'
import { getCurrentDate } from '../utils/date'
import BackToTopButton from '../components/BackToTopButton.vue' // Імпорт компонента
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'

const leftDrawerOpen = ref(false) // Сайдбар закритий за замовчуванням

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Отримуємо поточну локаль
const { locale } = useI18n()

// // Отримуємо поточну дату з utils/date.js
// const currentDate = ref(getCurrentDate())
// Використовуємо поточну локаль для формування дати
const currentDate = computed(() => getCurrentDate(locale.value))
</script>
