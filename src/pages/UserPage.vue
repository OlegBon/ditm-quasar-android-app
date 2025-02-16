<template>
  <q-page padding>
    <div v-if="user">
      <h1>Hello, {{ user.firstName || 'New User' }}!</h1>
      <div v-if="user.image">
        <img :src="user.image" alt="User Image" />
      </div>
      <div v-else>
        <q-icon name="ion-person" size="100px" />
      </div>
      <p>First Name: {{ user.firstName || 'First Name is empty. Please update.' }}</p>
      <p>Last Name: {{ user.lastName || 'Last Name is empty. Please update.' }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Username: {{ user.username || 'User' }}</p>
      <p>Company: {{ user.company?.name || 'Company information is empty. Please update.' }}</p>
      <p>Role: {{ user.role || 'Role information is empty. Please update.' }}</p>
      <q-btn label="Log Out" @click="logout" color="primary" />
    </div>
    <div v-else>
      <h1>Hello!</h1>
      <p>Please Sign In.</p>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'

const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.user)

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>
