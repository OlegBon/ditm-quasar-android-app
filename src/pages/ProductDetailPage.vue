<template>
  <ProductDetailLayout :title="product.title || 'Loading...'">
    <q-page padding class="q-mb-xl">
      <q-spinner
        v-if="!isDataLoaded"
        color="primary"
        size="50px"
        style="display: block; margin: 0 auto"
      />
      <div v-else>
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
            <p class="text-secondary">{{ capitalize(product.category) }}</p>
            <div>{{ product.description }}</div>
            <div class="text-top">{{ $t('content.productDetail.brand') }} {{ product.brand }}</div>
            <div class="text-top">{{ $t('content.productDetail.sku') }} {{ product.sku }}</div>
            <div class="text-top">
              {{ $t('content.productDetail.rating') }} {{ product.rating }}
            </div>
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
        <!-- Add Similar products -->
        <div class="similar-products">
          <h2 class="text-h5 text-center q-mt-xl">Similar Products</h2>
          <h5 v-if="isDataLoaded && similarProducts.length === 0" class="text-center">
            No similar products viewed products yet.
          </h5>
          <q-card v-if="isDataLoaded && similarProducts.length > 0" class="q-card-similar">
            <q-carousel v-model="activeSlide" animated swipeable>
              <q-carousel-slide
                v-for="(product, index) in similarProducts"
                :key="product.id"
                :name="index"
              >
                <div @click="goToProduct(product.id)" class="text-center" style="cursor: pointer">
                  <img :src="product.thumbnail" :alt="product.title" />
                  <p class="q-card-similar-text-title">{{ product.title }}</p>
                  <p>
                    {{ product.description.slice(0, 80)
                    }}{{ product.description.length > 140 ? '...' : '' }}
                  </p>
                  <p>{{ product.price }} $</p>
                </div>
              </q-carousel-slide>
            </q-carousel>
          </q-card>
        </div>
        <!-- Add recently viewed products -->
        <RecentlyViewedProducts />
      </div>
    </q-page>
  </ProductDetailLayout>
</template>

<script setup>
import { ref, computed, onMounted, capitalize } from 'vue'
import { api } from 'boot/axios'
import { useRoute } from 'vue-router'
import ProductDetailLayout from 'layouts/ProductDetailLayout.vue'
import { useCartStore } from 'src/store/cartStore'
import { tryFetchUser, user } from '../utils/userService'
import axios from 'axios'
import RecentlyViewedProducts from '../components/RecentlyViewedProducts.vue'

const router = useRoute()

const cartStore = useCartStore()

const product = ref({})
const isLoggedIn = computed(() => !!user.value)

const wishlist = ref([])
const similarProducts = ref([])

const isDataLoaded = ref(false) // Стан завантаження
const activeSlide = ref(0) // Поточний слайд у каруселі

const isLoading = ref(false)

onMounted(async () => {
  try {
    await tryFetchUser() // Завантаження користувача

    if (!user.value || !user.value.id) {
      console.warn('User data is not available after page refresh')
      return
    }

    // Завантаження продукту
    const { data } = await api(`https://dummyjson.com/products/${router.params.id}`)
    product.value = data
    // console.log('Product ID:', product.value.id) // Лог для перевірки

    // Завантаження списку бажань
    const responseWishlist = await axios.get('http://127.0.0.1:8000/api/wishlist', {
      params: { user_id: user.value.id },
    })
    wishlist.value = responseWishlist.data.map((product) => product.id)
    // console.log('Wishlist:', wishlist.value) // Лог для перевірки

    // Завантаження схожих товарів
    const responseSimilar = await axios.get('http://127.0.0.1:8000/api/products', {
      params: { category: product.value.category },
    })
    similarProducts.value = responseSimilar.data
    // console.log('Similar products:', similarProducts.value) // Лог для перевірки
  } catch (error) {
    console.error('Error loading similar viewed products:', error)
  } finally {
    isDataLoaded.value = true // Дані завантажені
  }
})

function addToCart(product) {
  cartStore.addItem(product)
}

function isInWishlist(productId) {
  return wishlist.value.includes(productId)
}

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

async function goToProduct(productId) {
  try {
    await axios.post('http://127.0.0.1:8000/api/user-viewed-products', {
      user_id: user.value.id,
      product_id: productId,
    })

    router.push(`/products/${productId}`)
  } catch (error) {
    console.error('Error adding viewed product:', error)
  }
}
</script>
