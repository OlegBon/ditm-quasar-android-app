<template>
  <q-page>
    <q-input v-model="search" debounce="500" filled placeholder="Search" class="search-products">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div>
      <q-list v-for="product in filteredProducts" :key="product.id" bordered separator>
        <q-item clickable v-ripple>
          <q-item-section class="product-img-section"
            ><img class="product-img" alt="Product image" :src="product.thumbnail"
          /></q-item-section>
          <q-item-section>{{ product.title }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from 'boot/axios'

const search = ref('') // Додаємо змінну search
let products = ref([])

// Фільтровані продукти на основі пошуку
const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter((product) =>
    product.title.toLowerCase().includes(search.value.toLowerCase()),
  )
})

api('https://dummyjson.com/products').then(({ data }) => {
  products.value = data.products
})
</script>
