import { useAuthStore } from "~/application/auth/useAuthStore"

export default defineNuxtPlugin(async() => {
  const auth = useAuthStore()
  await auth.fetchMe()
})
