<template>
  <q-page padding>
    <h1>Cart</h1>
    <q-list>
      <q-item v-for="item in cartItems" :key="item.id" bordered>
        <q-item-section>
          <img :src="item.thumbnail" alt="Product image" class="cart-img" />
        </q-item-section>
        <q-item-section>{{ item.title }}</q-item-section>
        <q-item-section>{{ item.price }}</q-item-section>
        <q-item-section>
          <q-input
            v-model.number="item.quantity"
            type="number"
            label="Quantity"
            @input="updateQuantity(item.id, item.quantity)"
          />
        </q-item-section>
        <q-item-section>
          <q-btn color="negative" @click="removeFromCart(item.id)">
            <q-icon name="delete" />
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <p class="total-price">Total Price: {{ totalPrice }}</p>
    <q-btn color="primary" @click="clearCart">Clear Cart</q-btn>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../store/cartStore'

const cartStore = useCartStore()

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
</script>
