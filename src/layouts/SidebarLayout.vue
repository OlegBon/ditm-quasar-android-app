<template>
  <q-drawer
    v-model="drawerOpen"
    :show-if-above="false"
    bordered
    @update:model-value="updateDrawerOpen"
  >
    <q-list>
      <q-item-label header> Welcome to App </q-item-label>

      <!-- Перший блок лінків -->
      <EssentialLink v-for="link in linksList.slice(0, 1)" :key="link.title" v-bind="link" />

      <q-separator />

      <!-- Другий блок лінків -->
      <EssentialLink v-for="link in linksList.slice(1, 5)" :key="link.title" v-bind="link" />

      <q-separator />

      <!-- Третій блок лінків -->
      <EssentialLink v-for="link in linksList.slice(5)" :key="link.title" v-bind="link" />
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:open'])

const drawerOpen = ref(props.open)

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

const linksList = [
  {
    title: 'Login',
    caption: 'Sign In',
    icon: 'ion-log-in',
    link: '/login',
  },
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
  {
    title: 'Github',
    caption: 'github.com/OlegBon',
    icon: 'code',
    link: 'https://github.com/OlegBon/ditm-quasar-android-app',
  },
]
</script>
