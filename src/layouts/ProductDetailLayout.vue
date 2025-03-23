<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> {{ title }} </q-toolbar-title>
        <div>{{ currentDate }}</div>
        <LanguageSwitcher />
      </q-toolbar>

      <q-tabs>
        <q-route-tab
          icon="ion-basket"
          to="/products"
          replace
          :label="$t('content.layoutProductDefault.tabProducts')"
        />
        <q-route-tab v-if="isLoggedIn">
          <div class="cart-icon-wrapper">
            <q-route-tab
              icon="ion-cart"
              to="/cart"
              replace
              :label="$t('content.layoutProductDefault.tabCart')"
            />
            <q-badge color="red" floating>{{ uniqueCartItemsCount }}</q-badge>
          </div>
        </q-route-tab>
        <q-route-tab
          v-else
          icon="login"
          to="/login"
          replace
          :label="$t('content.layoutProductDefault.tabLogin')"
        />
      </q-tabs>
    </q-header>

    <Sidebar v-model:open="leftDrawerOpen" />

    <q-page-container class="custom-page-container">
      <!-- Додано слот для відображення вмісту сторінки -->
      <slot></slot>
      <BackToTopButton />
    </q-page-container>

    <q-footer>
      <q-toolbar>
        <q-toolbar-title>
          <div class="footer">
            @2025 - {{ $t('content.layoutProductDefault.copyright') }} -
            <router-link class="link-footer" to="/">{{
              $t('content.layoutProductDefault.linkHome')
            }}</router-link>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { useUserStore } from '../store/userStore'
import { useCartStore } from '../store/cartStore'
import Sidebar from './SidebarLayout.vue'
import { getCurrentDate } from '../utils/date'
import BackToTopButton from '../components/BackToTopButton.vue'
import { tryFetchUser, user } from '../utils/userService'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

onMounted(() => {
  tryFetchUser()
})

const { title } = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const leftDrawerOpen = ref(false)
// const userStore = useUserStore()
const cartStore = useCartStore()

// const isLoggedIn = computed(() => !!userStore.user)
const isLoggedIn = computed(() => !!user.value)
const uniqueCartItemsCount = computed(() => cartStore.items.length)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const currentDate = ref(getCurrentDate())
</script>
