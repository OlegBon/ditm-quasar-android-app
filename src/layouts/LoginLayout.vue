<template>
  <DefaultLayout :title="$t('layouts.login')">
    <router-view />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from './DefaultLayout.vue'
</script>
