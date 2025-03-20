import { ref } from 'vue'
import axios from 'axios'

// Реактивна змінна для збереження даних користувача
const user = ref(null)

// Основна функція для отримання користувача
async function fetchUser() {
  const token = localStorage.getItem('api_token')
  if (!token) {
    throw new Error('No token') // Викидаємо помилку, якщо токену немає
  }

  const response = await axios.get('http://127.0.0.1:8000/api/current-user', {
    headers: { Authorization: `Bearer ${token}` },
  })
  user.value = response.data // Зберігаємо отримані дані
}

// Універсальна функція для роботи з токеном та користувачем
async function tryFetchUser() {
  try {
    // Викликаємо fetchUser, якщо токен присутній
    await fetchUser()
  } catch (error) {
    if (error.message === 'No token') {
      console.warn('User is not logged in, skipping fetchUser.')
    } else {
      console.error('Failed to fetch user:', error) // Обробка інших помилок
    }
    user.value = null // Скидаємо дані користувача у разі помилки
  }
}

export { user, fetchUser, tryFetchUser }
