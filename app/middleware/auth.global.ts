import { resolveAuthRedirect } from "./resolveAuthRedirect"

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const redirect = resolveAuthRedirect(auth.user, to.path)
  return redirect ? navigateTo(redirect) : undefined
})
