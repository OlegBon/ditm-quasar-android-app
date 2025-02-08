<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> {{ title }} </q-toolbar-title>
        <div>{{ currentDate }}</div>
      </q-toolbar>

      <q-tabs>
        <q-route-tab icon="home" to="/" replace label="Home" />
        <q-route-tab icon="ion-cart" to="/cart" replace label="Cart" />
      </q-tabs>
    </q-header>

    <Sidebar v-model:open="leftDrawerOpen" />

    <q-page-container>
      <router-view />
      <BackToTopButton />
    </q-page-container>

    <q-footer>
      <q-toolbar>
        <q-toolbar-title>
          <div class="footer">@2025 - All right reserved - OlegBon</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './SidebarLayout.vue'
import { getCurrentDate } from '../utils/date'
import BackToTopButton from '../components/BackToTopButton.vue' // Імпорт компонента

const { title } = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Отримуємо поточну дату з utils/date.js
const currentDate = ref(getCurrentDate())
</script>
