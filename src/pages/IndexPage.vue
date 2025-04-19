<template>
  <q-page padding>
    <h1>{{ $t('content.index.heading') }}</h1>
    <img
      class="home-img"
      alt="Quasar logo"
      src="~assets/home-banner.jpg"
      style="width: 100%; height: 100%"
    />
    <p class="p-16">
      {{ $t('content.index.text') }}
    </p>
    <RecentlyViewedProducts />
  </q-page>
</template>

<script setup>
import RecentlyViewedProducts from '../components/RecentlyViewedProducts.vue'

//
</script>
