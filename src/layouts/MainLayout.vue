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
import { ref } from 'vue'
import Sidebar from './SidebarLayout.vue'
import { getCurrentDate } from '../utils/date'
import BackToTopButton from '../components/BackToTopButton.vue' // Імпорт компонента
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const leftDrawerOpen = ref(false) // Сайдбар закритий за замовчуванням

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Отримуємо поточну дату з utils/date.js
const currentDate = ref(getCurrentDate())
</script>
