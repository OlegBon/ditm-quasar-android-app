<template>
  <ProductDetailLayout :title="product.title || 'Loading...'">
    <q-page padding>
      <q-card v-if="product.title">
        <q-card-section>
          <div class="text-h6">{{ product.title }}</div>
          <!-- Add favorite icon -->
          <q-icon
            v-if="isLoggedIn"
            :name="isInWishlist(product.id) ? 'favorite' : 'favorite_border'"
            class="absolute-top-right"
            size="lg"
            :style="{
              margin: '14px',
              color: isInWishlist(product.id) ? 'red' : 'grey',
              cursor: 'pointer',
            }"
            @click="handleWishlistClick(product.id)"
          />
        </q-card-section>

        <q-card-section>
          <img :src="product.thumbnail" alt="Product image" class="full-width" />
        </q-card-section>

        <q-card-section>
          <div>{{ product.description }}</div>
          <div class="text-top">{{ $t('content.productDetail.brand') }} {{ product.brand }}</div>
          <div class="text-top">{{ $t('content.productDetail.sku') }} {{ product.sku }}</div>
          <div class="text-top">{{ $t('content.productDetail.rating') }} {{ product.rating }}</div>
          <div class="text-top">
            {{ $t('content.productDetail.status') }} {{ product.availabilityStatus }}
          </div>
          <div class="text-top">
            {{ $t('content.productDetail.return') }} {{ product.returnPolicy }}
          </div>
          <div class="text-top">
            {{ $t('content.productDetail.warranty') }} {{ product.warrantyInformation }}
          </div>
          <div class="text-subtitle2 text-top">
            {{ $t('content.productDetail.price') }} {{ product.price }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-if="isLoggedIn" color="primary" @click="addToCart(product)">
            <q-icon name="ion-cart" />
            <span>{{ $t('content.productDetail.btnAddToCart') }}</span>
          </q-btn>
        </q-card-actions>
      </q-card>
      <q-card v-else>
        <q-card-section> {{ $t('content.productDetail.loadingTxt') }} </q-card-section>
      </q-card>
    </q-page>
  </ProductDetailLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useRoute } from 'vue-router'
import ProductDetailLayout from 'layouts/ProductDetailLayout.vue'
import { useCartStore } from 'src/store/cartStore'
import { tryFetchUser, user } from '../utils/userService'
import axios from 'axios'

const route = useRoute()
const cartStore = useCartStore()

const product = ref({})
const isLoggedIn = computed(() => !!user.value)

const wishlist = ref([])

onMounted(async () => {
  // Спочатку отримуємо користувача
  await tryFetchUser()

  // Перевірка, чи користувач все ще доступний
  if (!user.value || !user.value.id) {
    console.warn('User data is not available after page refresh')
    return
  }

  // Завантаження продукту
  const { data } = await api(`https://dummyjson.com/products/${route.params.id}`)
  product.value = data

  // Завантаження списку бажань
  const response = await axios.get('http://127.0.0.1:8000/api/wishlist', {
    params: { user_id: user.value.id },
  })
  wishlist.value = response.data.map((product) => product.id)
})

function addToCart(product) {
  cartStore.addItem(product)
}

function isInWishlist(productId) {
  return wishlist.value.includes(productId)
}

const isLoading = ref(false)

async function handleWishlistClick(productId) {
  if (isLoading.value) return // Запобігаємо дублювання кліків
  isLoading.value = true // Початок завантаження

  try {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  } catch (error) {
    console.error('Error updating wishlist:', error)
  } finally {
    isLoading.value = false // Завершення завантаження
  }
}

async function addToWishlist(productId) {
  if (!user.value.id) return

  try {
    await axios.post('http://127.0.0.1:8000/api/wishlist/add', {
      user_id: user.value.id,
      product_id: productId,
    })
    wishlist.value.push(productId) // Оновлюємо локальний список бажань
  } catch (error) {
    console.error('Error adding to wishlist:', error)
  }
}

async function removeFromWishlist(productId) {
  if (!user.value.id) return

  try {
    await axios.post('http://127.0.0.1:8000/api/wishlist/delete', {
      user_id: user.value.id,
      product_id: productId,
    })
    wishlist.value = wishlist.value.filter((id) => id !== productId) // Оновлюємо список
    // console.log('Removed from wishlist:', productId) // Лог для перевірки
  } catch (error) {
    console.error('Error removing from wishlist:', error)
  }
}
</script>
