import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

import type { AuthUser } from "~/types/auth"

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter()
  const user = ref<AuthUser | null>(null)

  async function fetchMe() {
    try {
      const data = await $fetch<{ user: AuthUser }>("/api/auth/me")
      user.value = data.user
    } catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch<{ user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: {
        email,
        password,
      },
    })
    user.value = data.user
    await router.push("/dashboard")
  }

  async function register(username: string, email: string, password: string) {
    const data = await $fetch<{ user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: {
        username,
        email,
        password,
      },
    })
    user.value = data.user
    await router.push("/dashboard")
  }

  async function logout() {
    await $fetch("/api/auth/logout", { method: "POST" })
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
