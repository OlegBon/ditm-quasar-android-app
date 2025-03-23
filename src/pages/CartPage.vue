<template>
  <q-page padding>
    <h1>{{ $t('content.cart.heading') }}</h1>
    <q-list>
      <q-item v-for="item in cartItems" :key="item.id" bordered>
        <q-item-section clickable @click="goToProduct(item.id)">
          <img :src="item.thumbnail" alt="Product image" class="cart-img" />
        </q-item-section>
        <q-item-section clickable @click="goToProduct(item.id)">
          {{ item.title }}
        </q-item-section>
        <q-item-section clickable @click="goToProduct(item.id)">
          {{ item.price }}
        </q-item-section>
        <q-item-section>
          <q-input
            v-model.number="item.quantity"
            type="number"
            :label="$t('content.cart.quantity')"
            @input="updateQuantity(item.id, item.quantity)"
          />
        </q-item-section>
        <q-item-section>
          <q-btn color="negative" @click.stop="removeFromCart(item.id)">
            <q-icon name="delete" />
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <p class="total-price">{{ $t('content.cart.totalPrice') }} {{ totalPrice }}</p>
    <q-btn color="primary" @click="clearCart">{{ $t('content.cart.clearCart') }}</q-btn>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../store/cartStore'

const cartStore = useCartStore()
const router = useRouter()

const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)

function removeFromCart(productId) {
  cartStore.removeItem(productId)
}

function clearCart() {
  cartStore.clearCart()
}

function updateQuantity(productId, quantity) {
  cartStore.updateQuantity(productId, quantity)
}

function goToProduct(productId) {
  router.push(`/products/${productId}`)
}
</script>
