<template>
  <q-page padding class="q-mb-xl">
    <q-input
      v-model="search"
      debounce="500"
      filled
      :placeholder="$t('content.products.placeholderSearch')"
      class="search-products"
    >
      <template v-slot:append>
        <q-icon v-if="!search" name="search" />
        <q-icon v-if="search" name="close" @click="clearSearch" />
      </template>
    </q-input>

    <!-- Фільтр за категоріями -->
    <q-select
      filled
      v-model="selectedCategory"
      :options="categoryOptions"
      :label="$t('content.products.labelSelectCategory')"
      class="filter-products"
      behavior="menu"
      option-label="label"
      option-value="value"
    />

    <q-spinner
      v-if="!isLoading"
      color="primary"
      size="50px"
      style="display: block; margin: 0 auto"
    />
    <div v-else>
      <p class="quantity-products">
        {{ $t('content.products.quantityOfProducts') }}<span>{{ productCount }}</span>
      </p>

      <div>
        <q-list
          v-for="product in filteredAndDisplayedProducts"
          :key="product.id"
          bordered
          separator
        >
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
              <q-btn v-if="isLoggedIn" color="primary" @click.stop="addToCart(product)">
                <q-icon name="ion-cart" />
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useCartStore } from '../store/cartStore'
import { tryFetchUser, user } from '../utils/userService'
import axios from 'axios'

const isLoading = ref(false)

onMounted(() => {
  tryFetchUser()
})

const cartStore = useCartStore()
const router = useRouter()

const search = ref('')
const selectedCategory = ref({ label: 'All Products', value: '' })
const allProducts = ref([])
const categories = ref([])
const limit = ref(30)
const page = ref(1)

const isLoggedIn = computed(() => !!user.value)

const productCount = computed(() => {
  if (search.value) {
    return filteredAndDisplayedProducts.value.length
  }
  if (selectedCategory.value === null || selectedCategory.value.value === '') {
    return allProducts.value.length
  }
  const categoryValue = selectedCategory.value.value
  return allProducts.value.filter((product) => product.category === categoryValue).length
})

const filteredAndDisplayedProducts = computed(() => {
  let filteredProducts = allProducts.value

  if (selectedCategory.value.value !== '') {
    const categoryValue = selectedCategory.value.value

    if (categoryValue) {
      filteredProducts = filteredProducts.filter((product) => product.category === categoryValue)
    }
  }

  if (search.value) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(search.value.toLowerCase()),
    )
  }

  return filteredProducts.slice(0, page.value * limit.value)
})

const categoryOptions = computed(() => [{ label: 'All Products', value: '' }, ...categories.value])

async function loadCategories() {
  const { data } = await api('https://dummyjson.com/products/categories')
  categories.value = data.map((category) => ({
    label: category.name,
    value: category.slug,
  }))
}

async function loadAllProducts() {
  // const { data } = await api('https://dummyjson.com/products?limit=0')
  // const { data } = await api('http://127.0.0.1:8000/api/products')
  const { data } = await api('https://testbackend.bon.kharkov.ua/api/products')
  // allProducts.value = data.products
  allProducts.value = data
  isLoading.value = true // Дані завантажені
}

onMounted(() => {
  loadCategories()
  loadAllProducts()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
    loadMore()
  }
}

function loadMore() {
  page.value++
}

function clearSearch() {
  search.value = ''
}

function addToCart(product) {
  if (isLoggedIn.value) {
    cartStore.addItem(product)
  }
}

// function goToProduct(productId) {
//   router.push(`/products/${productId}`)
// }

async function goToProduct(productId) {
  try {
    // Додаємо запис про перегляд у базу
    await axios.post('http://127.0.0.1:8000/api/user-viewed-products', {
      user_id: user.value.id, // ID користувача
      product_id: productId, // ID товару
    })

    // console.log(`Product ID ${productId} was added to recently viewed`)

    // Переходимо до сторінки товару
    router.push(`/products/${productId}`)
  } catch (error) {
    console.error('Error adding viewed product:', error)
  }
}
</script>
