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
          :label="$t('content.layoutDefault.tabProducts')"
        />
        <q-route-tab v-if="isLoggedIn">
          <div class="cart-icon-wrapper">
            <q-route-tab
              icon="ion-cart"
              to="/cart"
              replace
              :label="$t('content.layoutDefault.tabCart')"
            />
            <q-badge color="red" floating>{{ uniqueCartItemsCount }}</q-badge>
          </div>
        </q-route-tab>
        <q-route-tab
          v-else
          icon="login"
          to="/login"
          replace
          :label="$t('content.layoutDefault.tabLogin')"
        />
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
          <div class="footer">
            @2025 - {{ $t('content.layoutDefault.copyright') }} -
            <router-link class="link-footer" to="/">{{
              $t('content.layoutDefault.linkHome')
            }}</router-link>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../store/cartStore'
import Sidebar from './SidebarLayout.vue'
import { getCurrentDate } from '../utils/date'
import BackToTopButton from '../components/BackToTopButton.vue'
import { tryFetchUser, user } from '../utils/userService'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'

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
const cartStore = useCartStore()

const isLoggedIn = computed(() => !!user.value)
const uniqueCartItemsCount = computed(() => cartStore.items.length)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// const currentDate = ref(getCurrentDate())
const { locale } = useI18n()
const currentDate = computed(() => getCurrentDate(locale.value))
</script>
