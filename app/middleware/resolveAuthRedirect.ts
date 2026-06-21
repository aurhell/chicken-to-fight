import type { AuthUser } from "../domain/auth/AuthUser"

const PUBLIC_ROUTE_NAMES = [
  "login",
  "register",
]

export function resolveAuthRedirect(user: AuthUser | null, routeName: string): string | null {
  if (routeName === "index") return user ? "/dashboard" : "/login"
  const isPublic = PUBLIC_ROUTE_NAMES.includes(routeName)
  if (!user && !isPublic) return "/login"
  if (user && isPublic) return "/dashboard"
  return null
}
