import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

import { useAuthApi } from "~/infrastructure/api/auth"

import type { AuthUser } from "~/domain/auth/AuthUser"

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter()
  const api = useAuthApi()
  const user = ref<AuthUser | null>(null)

  async function fetchMe() {
    try {
      const data = await api.fetchMe()
      user.value = data.user
    } catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    const data = await api.login(email, password)
    user.value = data.user
    await router.push("/dashboard")
  }

  async function register(username: string, email: string, password: string) {
    const data = await api.register(username, email, password)
    user.value = data.user
    await router.push("/dashboard")
  }

  async function logout() {
    await api.logout()
    user.value = null
    await router.push("/login")
  }

  return {
    user,
    fetchMe,
    login,
    register,
    logout, 
  }
})
