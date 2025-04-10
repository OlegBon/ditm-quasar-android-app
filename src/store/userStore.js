import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    setUser(user) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
    login(user) {
      this.setUser(user)
    },
    logout() {
      this.clearUser()
    },
  },
})
