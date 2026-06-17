import type { AuthUser } from "../types/auth"

const PUBLIC_ROUTES = [
  "/login",
  "/register",
]

export function resolveAuthRedirect(user: AuthUser | null, path: string): string | null {
  const isPublic = PUBLIC_ROUTES.includes(path)
  if (!user && !isPublic) return "/login"
  if (user && isPublic) return "/dashboard"
  return null
}
