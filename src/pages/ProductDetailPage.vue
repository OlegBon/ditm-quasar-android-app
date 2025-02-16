<template>
  <ProductDetailLayout :title="product.title || 'Loading...'">
    <q-page padding>
      <q-card v-if="product.title">
        <q-card-section>
          <div class="text-h6">{{ product.title }}</div>
        </q-card-section>

        <q-card-section>
          <img :src="product.thumbnail" alt="Product image" class="full-width" />
        </q-card-section>

        <q-card-section>
          <div>{{ product.description }}</div>
          <div class="text-top">Brand: {{ product.brand }}</div>
          <div class="text-top">SKU: {{ product.sku }}</div>
          <div class="text-top">Rating: {{ product.rating }}</div>
          <div class="text-top">Status: {{ product.availabilityStatus }}</div>
          <div class="text-top">Return: {{ product.returnPolicy }}</div>
          <div class="text-top">Warranty: {{ product.warrantyInformation }}</div>
          <div class="text-subtitle2 text-top">Price: {{ product.price }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-if="isLoggedIn" color="primary" @click="addToCart(product)">
            <q-icon name="ion-cart" />
            <span>Add to Cart</span>
          </q-btn>
        </q-card-actions>
      </q-card>
      <q-card v-else>
        <q-card-section> Loading product information... </q-card-section>
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
import { useUserStore } from 'src/store/userStore' // імпортуємо userStore

const route = useRoute()
const cartStore = useCartStore()
const userStore = useUserStore() // використовуємо userStore

const product = ref({})
const isLoggedIn = computed(() => userStore.isLoggedIn) // визначаємо isLoggedIn

onMounted(async () => {
  const { data } = await api(`https://dummyjson.com/products/${route.params.id}`)
  product.value = data
})

function addToCart(product) {
  cartStore.addItem(product)
}
</script>
