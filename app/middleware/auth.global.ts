import { resolveAuthRedirect } from "./resolveAuthRedirect"

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const localePath = useLocalePath()
  const routeName = (to.name as string)?.replace(/___\w+$/, "") ?? ""
  const redirect = resolveAuthRedirect(auth.user, routeName)
  return redirect ? navigateTo(localePath(redirect)) : undefined
})
