<template>
  <q-page padding>
    <div v-if="user">
      <h1>Hello, {{ user.firstName }}!</h1>
      <img :src="user.image" alt="User Image" />
      <p>First Name: {{ user.firstName }}</p>
      <p>Last Name: {{ user.lastName }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Username: {{ user.username }}</p>
      <p>Company: {{ user.company.name }}</p>
      <p>Role: {{ user.role }}</p>
      <q-btn label="Log Out" @click="logout" color="primary" />
    </div>
    <div v-else>
      <h1>Hello!</h1>
      <p>Please Sign In.</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const user = ref(null)
const router = useRouter()

function checkUser() {
  const loggedInUser = localStorage.getItem('loggedInUser')
  if (loggedInUser) {
    user.value = JSON.parse(loggedInUser)
  }
}

function logout() {
  localStorage.removeItem('loggedInUser')
  user.value = null
  router.push('/login')
}

onMounted(() => {
  checkUser()
})
</script>
