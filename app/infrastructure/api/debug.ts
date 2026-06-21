import { useApiClient } from "./client"

export function useDebugApi() {
  const api = useApiClient()

  return {
    addGold: (amount: number) =>
      api.post<{ gold: number }>("/api/debug/add-gold", { amount }),
    fastHatch: (id: number) =>
      api.post<{ ok: boolean }>(`/api/debug/chicken/${id}/fast-hatch`, {}),
    driftCare: (id: number) =>
      api.post<{ ok: boolean }>(`/api/debug/chicken/${id}/drift-care`, {}),
    resetCare: (id: number) =>
      api.post<{ ok: boolean }>(`/api/debug/chicken/${id}/reset-care`, {}),
  }
}
