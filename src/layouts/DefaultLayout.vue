<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> {{ title }} </q-toolbar-title>
      </q-toolbar>

      <q-tabs>
        <q-route-tab icon="home" to="/" replace label="Home" />
        <q-route-tab icon="ion-cart" to="/cart" replace label="Cart" />
      </q-tabs>
    </q-header>

    <Sidebar v-model:open="leftDrawerOpen" />

    <q-footer>
      <q-toolbar>
        <q-toolbar-title> <div class="footer">@2025 - All right reserved</div> </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import Sidebar from './SidebarLayout.vue'

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
</script>
