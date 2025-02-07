<template>
  <q-page>
    <div>
      <h1>All Products</h1>
    </div>
    <div>
      <q-list v-for="product in products" :key="product.id" bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>{{ product.title }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
let products = ref([])
api('https://dummyjson.com/products').then(({ data }) => {
  products.value = data.products
})
</script>
