import { ref } from 'vue'
import axios from 'axios'

const user = ref(null)

async function fetchUser() {
  const token = localStorage.getItem('api_token')
  if (!token) {
    user.value = null
    throw new Error('No token')
  }

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/current-user', {
      headers: { Authorization: `Bearer ${token}` },
    })
    user.value = response.data
  } catch (error) {
    user.value = null
    throw error
  }
}

export { user, fetchUser }
