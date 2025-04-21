<template>
  <q-page padding class="q-mb-xl">
    <h1>Welcome to your Wishlist!</h1>
    <q-spinner
      v-if="!isDataLoaded"
      color="primary"
      size="50px"
      style="display: block; margin: 0 auto"
    />
    <div v-else>
      <div>
        <h5 v-if="wishlist.length === 0" class="text-center">Your wishlist is empty.</h5>
      </div>
      <div v-if="wishlist.length > 0">
        <p>
          Products in your wishlist:
          <span>{{ wishlist.length }}</span>
        </p>
        <q-list v-for="product in wishlist" :key="product.id" bordered separator>
          <q-item clickable v-ripple @click="goToProduct(product.id)">
            <q-item-section class="product-img-section">
              <img
                class="product-img"
                alt="Product image"
                :src="product.thumbnail"
                loading="lazy"
              />
            </q-item-section>
            <q-item-section>{{ product.title }}</q-item-section>
            <q-item-section class="button-section">
              <q-icon
                name="favorite"
                class="absolute-top-right"
                size="lg"
                style="margin: 20px 14px; color: red; cursor: pointer"
                @click.stop="removeFromWishlist(product.id)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tryFetchUser, user } from '../utils/userService'
import axios from 'axios'
import { useRouter } from 'vue-router'

const isDataLoaded = ref(false) // Додана змінна для контролю стану завантаження
const router = useRouter()

const wishlist = ref([])

onMounted(async () => {
  try {
    // Завантаження користувача
    await tryFetchUser()

    if (!user.value || !user.value.id) {
      console.warn('User data is not available after page refresh')
      return
    }

    // Завантаження даних із бекенду
    const response = await axios.get('http://127.0.0.1:8000/api/wishlist', {
      params: { user_id: user.value.id },
    })
    wishlist.value = response.data
    // console.log('Wishlist data:', wishlist.value) // Лог для перевірки
  } catch (error) {
    console.error('Error loading wishlist:', error)
  } finally {
    isDataLoaded.value = true // Дані завантажені
  }
})

function goToProduct(productId) {
  router.push(`/products/${productId}`)
}

async function removeFromWishlist(productId) {
  if (!user.value.id) return

  try {
    await axios.post('http://127.0.0.1:8000/api/wishlist/delete', {
      user_id: user.value.id,
      product_id: productId,
    })
    wishlist.value = wishlist.value.filter((product) => product.id !== productId) // Оновлюємо список
    // console.log('Removed from wishlist:', productId) // Лог для перевірки
  } catch (error) {
    console.error('Error removing from wishlist:', error)
  }
}
</script>
