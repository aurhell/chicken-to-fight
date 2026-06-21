import { useApiClient } from "./client"

import type { AuthUser } from "~/domain/auth/AuthUser"

export function useAuthApi() {
  const api = useApiClient()

  return {
    fetchMe: () =>
      api.get<{ user: AuthUser }>("/api/auth/me"),
    login: (email: string, password: string) =>
      api.post<{ user: AuthUser }>("/api/auth/login", {
        email,
        password, 
      }),
    register: (username: string, email: string, password: string) =>
      api.post<{ user: AuthUser }>("/api/auth/register", {
        username,
        email,
        password, 
      }),
    logout: () =>
      api.post<void>("/api/auth/logout", {}),
  }
}
