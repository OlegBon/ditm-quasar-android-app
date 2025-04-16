<template>
  <ProductDetailLayout :title="product.title || 'Loading...'">
    <q-page padding>
      <q-card v-if="product.title">
        <q-card-section>
          <div class="text-h6">{{ product.title }}</div>
          <!-- Add favorite icon -->
          <q-icon
            v-if="isLoggedIn"
            name="ion-heart"
            class="absolute-top-right"
            size="lg"
            style="margin: 14px; color: #ffcccc"
            @click="addWishList(product.id)"
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

onMounted(() => {
  tryFetchUser()
})

const route = useRoute()
const cartStore = useCartStore()

const product = ref({})
const isLoggedIn = computed(() => !!user.value)

const wishlist = ref([])

onMounted(async () => {
  const { data } = await api(`https://dummyjson.com/products/${route.params.id}`)
  product.value = data
})

function addToCart(product) {
  cartStore.addItem(product)
}

function isInWishlist(productId) {
  return wishlist.value.includes(productId)
}

async function addWishList(productId) {
  if (!user.value.id) return

  const url = isInWishlist(productId)
    ? 'http://127.0.0.1:8000/api/wishlist/delete'
    : 'http://127.0.0.1:8000/api/wishlist/add'

  await axios.post(url, {
    user_id: user.value.id,
    product_id: productId,
  })

  if (isInWishlist(productId)) {
    wishlist.value = wishlist.value.filter((id) => id !== productId)
  } else {
    wishlist.value.push(productId)
  }
}
</script>
