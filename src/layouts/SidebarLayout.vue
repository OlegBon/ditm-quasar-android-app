<template>
  <q-drawer
    v-model="drawerOpen"
    :show-if-above="false"
    bordered
    @update:model-value="updateDrawerOpen"
  >
    <q-list>
      <q-item-label header> Welcome to App </q-item-label>

      <!-- Лінки для залогінених користувачів -->
      <q-item
        clickable
        v-if="isLoggedIn"
        :key="userLink.title"
        tag="router-link"
        :to="userLink.link"
      >
        <q-item-section avatar>
          <q-avatar v-if="userLink.icon !== 'ion-person'">
            <img :src="userLink.icon" alt="User Image" />
          </q-avatar>
          <q-icon v-else name="ion-person" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ userLink.title }}</q-item-label>
          <q-item-label caption>{{ userLink.caption }}</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Лінки для незалогінених користувачів -->
      <q-item clickable v-else :key="loginLink.title" tag="router-link" :to="loginLink.link">
        <q-item-section avatar>
          <q-icon :name="loginLink.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ loginLink.title }}</q-item-label>
          <q-item-label caption>{{ loginLink.caption }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <!-- Основні лінки -->
      <q-item
        v-for="link in visibleLinksList"
        :key="link.title"
        clickable
        tag="router-link"
        :to="link.link"
      >
        <q-item-section avatar>
          <q-icon :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ link.title }}</q-item-label>
          <q-item-label caption>{{ link.caption }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <!-- Додаткові лінки -->
      <q-item
        v-for="link in additionalLinksList"
        :key="link.title"
        clickable
        tag="a"
        :href="link.link"
        target="_blank"
      >
        <q-item-section avatar>
          <q-icon :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ link.title }}</q-item-label>
          <q-item-label caption>{{ link.caption }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:open'])

const drawerOpen = ref(props.open)
const isLoggedIn = ref(false)
const user = ref(null)

watch(
  () => props.open,
  (newVal) => {
    drawerOpen.value = newVal
  },
)

function updateDrawerOpen(value) {
  drawerOpen.value = value
  emit('update:open', value)
}

function checkLoggedIn() {
  const loggedInUser = localStorage.getItem('loggedInUser')
  if (loggedInUser) {
    user.value = JSON.parse(loggedInUser)
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
  }
}

const loginLink = {
  title: 'Login',
  caption: 'Sign In',
  icon: 'ion-log-in',
  link: '/login',
}

const userLink = computed(() => ({
  title: user.value?.username || 'User',
  caption: user.value?.email || '',
  icon: user.value?.image || 'ion-person',
  link: '/user',
}))

const linksList = ref([
  {
    title: 'About',
    caption: 'About Us',
    icon: 'ion-md-hand',
    link: '/about',
  },
  {
    title: 'Products',
    caption: 'All Products',
    icon: 'ion-basket',
    link: '/products',
  },
  {
    title: 'Cart',
    caption: 'Basket',
    icon: 'ion-cart',
    link: '/cart',
  },
  {
    title: 'Contacts',
    caption: 'Contacts',
    icon: 'map',
    link: '/contacts',
  },
])

const additionalLinksList = [
  {
    title: 'Github',
    caption: 'github.com/OlegBon',
    icon: 'code',
    link: 'https://github.com/OlegBon/ditm-quasar-android-app',
  },
]

const visibleLinksList = computed(() => {
  return isLoggedIn.value
    ? linksList.value
    : linksList.value.filter((link) => link.title !== 'Cart')
})

onMounted(() => {
  checkLoggedIn()
})
</script>
