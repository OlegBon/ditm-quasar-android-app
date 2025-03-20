<template>
  <q-page padding>
    <q-input v-model="search" debounce="500" filled placeholder="Search" class="search-products">
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
      label="Select Category"
      class="filter-products"
      behavior="menu"
      option-label="label"
      option-value="value"
    />

    <p class="quantity-products">
      Quantity of Products: <span>{{ productCount }}</span>
    </p>

    <div>
      <q-list v-for="product in filteredAndDisplayedProducts" :key="product.id" bordered separator>
        <q-item clickable v-ripple @click="goToProduct(product.id)">
          <q-item-section class="product-img-section">
            <img class="product-img" alt="Product image" :src="product.thumbnail" loading="lazy" />
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
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useCartStore } from '../store/cartStore'
import { tryFetchUser, user } from '../utils/userService'

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

function goToProduct(productId) {
  router.push(`/products/${productId}`)
}
</script>
