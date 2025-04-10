<template>
  <q-drawer
    v-model="drawerOpen"
    :show-if-above="false"
    bordered
    @update:model-value="updateDrawerOpen"
  >
    <q-list>
      <q-item-label header> {{ $t('content.layoutSidebar.welcome') }} </q-item-label>

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
          <q-item-label :caption="true">{{ userLink.caption }}</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Лінки для незалогінених користувачів -->
      <q-item clickable v-else :key="loginLink.title" tag="router-link" :to="loginLink.link">
        <q-item-section avatar>
          <q-icon :name="loginLink.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ loginLink.title }}</q-item-label>
          <q-item-label :caption="true">{{ loginLink.caption }}</q-item-label>
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
          <q-item-label>
            {{ link.title }}
            <!-- <q-badge v-if="link.title === 'Cart'" color="red" class="badge-custom">{{ -->
            <q-badge
              v-if="link.title === t('content.layoutSidebar.linkCart')"
              color="red"
              class="badge-custom"
              >{{ uniqueCartItemsCount }}</q-badge
            >
          </q-item-label>
          <q-item-label :caption="true">{{ link.caption }}</q-item-label>
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
          <q-item-label :caption="true">{{ link.caption }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useCartStore } from '../store/cartStore'
import { tryFetchUser, user } from '../utils/userService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

onMounted(() => {
  tryFetchUser()
})

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:open'])

const drawerOpen = ref(props.open)
const cartStore = useCartStore()

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

const loginLink = computed(() => ({
  // title: 'Login',
  title: t('content.layoutSidebar.linkLogin'),
  caption: t('content.layoutSidebar.linkLogin'),
  icon: 'ion-log-in',
  link: '/login',
}))

const userLink = computed(() => ({
  title: user.value?.name || t('content.layoutSidebar.linkUser'),
  caption: user.value?.email || '',
  icon: 'ion-person',
  link: '/user',
}))

const isLoggedIn = computed(() => !!user.value)

const linksList = computed(() => [
  {
    title: t('content.layoutSidebar.linkAbout'),
    caption: t('content.layoutSidebar.linkAbout'),
    icon: 'ion-md-hand',
    link: '/about',
  },
  {
    title: t('content.layoutSidebar.linkProducts'),
    caption: t('content.layoutSidebar.linkAllProducts'),
    icon: 'ion-basket',
    link: '/products',
  },
  {
    // title: 'Cart',
    // caption: 'Cart',
    title: t('content.layoutSidebar.linkCart'),
    caption: t('content.layoutSidebar.linkCart'),
    icon: 'ion-cart',
    link: '/cart',
  },
  {
    title: 'Wishlist',
    caption: 'Yor Wishlist',
    icon: 'ion-heart',
    link: '/wishlist',
  },
  {
    title: t('content.layoutSidebar.linkContacts'),
    caption: t('content.layoutSidebar.linkContacts'),
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
    : // : linksList.value.filter((link) => link.title !== 'Cart')
      linksList.value.filter(
        (link) => link.title !== t('content.layoutSidebar.linkCart') && link.title !== 'Wishlist',
      )
})

const uniqueCartItemsCount = computed(() => cartStore.items.length)
</script>
