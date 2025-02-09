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
      <q-item clickable v-if="isLoggedIn" :key="userLink.title" tag="a" :href="userLink.link">
        <q-item-section avatar>
          <q-avatar v-if="userLink.icon">
            <img :src="userLink.icon" alt="User Image" />
          </q-avatar>
          <q-icon v-else name="person" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ userLink.title }}</q-item-label>
          <q-item-label caption>{{ userLink.caption }}</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Лінки для незалогінених користувачів -->
      <EssentialLink
        v-else
        :key="loginLink.title"
        :title="loginLink.title"
        :caption="loginLink.caption"
        :icon="loginLink.icon"
        :link="loginLink.link"
      />

      <q-separator />

      <!-- Основні лінки -->
      <EssentialLink
        v-for="link in visibleLinksList"
        :key="link.title"
        :title="link.title"
        :caption="link.caption"
        :icon="link.icon"
        :link="link.link"
      />

      <q-separator />

      <!-- Додаткові лінки -->
      <EssentialLink
        v-for="link in additionalLinksList"
        :key="link.title"
        :title="link.title"
        :caption="link.caption"
        :icon="link.icon"
        :link="link.link"
      />
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

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
  title: user.value && user.value.username ? user.value.username : 'User',
  caption: user.value ? user.value.email : '',
  icon: user.value && user.value.image ? user.value.image : 'ion-person',
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
  if (isLoggedIn.value) {
    return linksList.value
  } else {
    return linksList.value.filter((link) => link.title !== 'Cart')
  }
})

onMounted(() => {
  checkLoggedIn()
})
</script>
