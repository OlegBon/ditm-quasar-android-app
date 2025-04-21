<template>
  <div>
    <h2 class="text-h5 text-center q-mt-xl">Recently Viewed Products</h2>
    <q-spinner
      v-if="!isDataLoaded"
      color="primary"
      size="50px"
      style="display: block; margin: 0 auto"
    />
    <div v-else>
      <h5 v-if="isDataLoaded && viewedProducts.data.length === 0" class="text-center">
        No recently viewed products yet.
      </h5>
      <q-card v-if="isDataLoaded && viewedProducts.data.length > 0" class="q-card-recent">
        <q-carousel v-model="activeSlide" animated swipeable>
          <q-carousel-slide
            v-for="(product, index) in viewedProducts.data"
            :key="product.id"
            :name="index"
          >
            <div @click="goToProduct(product.id)" class="text-center" style="cursor: pointer">
              <img :src="product.thumbnail" :alt="product.title" />
              <p class="q-card-recent-text-title">{{ product.title }}</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { tryFetchUser, user } from '../utils/userService'

const router = useRouter()
// const viewedProducts = ref({}) // Список переглянутих продуктів
// const viewedProducts = ref([]) // Список переглянутих продуктів
const viewedProducts = ref({ data: [] }) // Список переглянутих продуктів
const isDataLoaded = ref(false) // Стан завантаження
const activeSlide = ref(0) // Поточний слайд у каруселі

onMounted(async () => {
  try {
    await tryFetchUser() // Завантаження користувача

    if (!user.value || !user.value.id) {
      console.warn('User data is not available after page refresh')
      return
    }

    const response = await axios.get('http://127.0.0.1:8000/api/user-viewed-products', {
      params: { user_id: user.value.id },
    })
    // viewedProducts.value = response.data // Завантаження переглянутих продуктів
    // viewedProducts.value.data = response.data.data // Заповнюємо масив даними
    viewedProducts.value = { data: response.data.data } // Гарантовано передаємо масив у data
    // console.log('Recently viewed products:', viewedProducts.value.data)
  } catch (error) {
    console.error('Error loading recently viewed products:', error)
  } finally {
    isDataLoaded.value = true // Дані завантажені
  }
})

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
