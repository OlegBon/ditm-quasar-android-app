<template>
  <q-btn
    v-if="showBackToTop"
    @click="scrollToTop"
    icon="arrow_upward"
    fab
    outline
    class="back-to-top"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showBackToTop = ref(false)

function handleScroll() {
  showBackToTop.value = window.scrollY > 200 // Показуємо кнопку після прокручування 200px
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' }) // Плавний перехід до верху сторінки
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
