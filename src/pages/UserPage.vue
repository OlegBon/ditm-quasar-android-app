<template>
  <q-page padding class="flex column items-center">
    <h1>{{ $t('content.user.heading') }}</h1>
    <div style="max-width: 400px; margin-top: 40px" class="q-mx-auto">
      <p class="big-text text-center">{{ $t('content.user.hello') }} {{ userName }}</p>
      <p class="big-text text-center">{{ $t('content.user.yourEmail') }} {{ userEmail }}</p>
    </div>

    <q-btn :label="$t('content.user.btnLogout')" color="primary" class="q-mt-md" @click="logout" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// Поля для імені та email
const userName = ref('')
const userEmail = ref('')

// Роутер для перенаправлення
const router = useRouter()

onMounted(() => {
  loadProfile()
})

function loadProfile() {
  const token = localStorage.getItem('api_token')
  if (!token) {
    // Немає токена -> логін
    router.push('/login')
    return
  }

  // Робимо запит /api/current-user
  axios
    .get('http://127.0.0.1:8000/api/current-user', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((response) => {
      // Сервер поверне { id, name, email }
      userName.value = response.data.name
      userEmail.value = response.data.email
    })
    .catch((error) => {
      console.error('Error fetching profile:', error.response?.data || error)
      // Якщо токен недійсний (401), видаляємо токен і відправляємо на логін
      if (error.response?.status === 401) {
        localStorage.removeItem('api_token')
        router.push('/login')
      }
    })
}

function logout() {
  const token = localStorage.getItem('api_token')
  if (!token) {
    router.push('/login')
    return
  }

  // Викликаємо POST /api/logout
  axios
    .post('http://127.0.0.1:8000/api/logout', null, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((response) => {
      console.log('Logout success:', response.data)
      // Видаляємо токен на фронтенді
      localStorage.removeItem('api_token')
      // Переходимо на логін
      router.push('/login')
    })
    .catch((error) => {
      console.error('Logout error:', error.response?.data || error)
    })
}
</script>
