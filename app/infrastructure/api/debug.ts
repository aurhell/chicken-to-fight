import { useApiClient } from "./client"

export function useDebugApi() {
  const api = useApiClient()

  return {
    addGold: (amount: number) =>
      api.post<{ gold: number }>("/api/debug/add-gold", { amount }),
    refillInventory: () =>
      api.post<{ water: number; flour: number }>("/api/debug/refill-inventory", {}),
    drainChick: () =>
      api.post<{ ok: boolean }>("/api/debug/drain-chick", {}),
    fastGrowChick: () =>
      api.post<{ ok: boolean }>("/api/debug/fast-grow-chick", {}),
    fastHatch: (id: number) =>
      api.post<{ ok: boolean }>(`/api/debug/chicken/${id}/fast-hatch`, {}),
    driftCare: (id: number) =>
      api.post<{ ok: boolean }>(`/api/debug/chicken/${id}/drift-care`, {}),
    resetCare: (id: number) =>
      api.post<{ ok: boolean }>(`/api/debug/chicken/${id}/reset-care`, {}),
    completeStages: (id: number) =>
      api.post<{ ok: boolean }>(`/api/debug/chicken/${id}/complete-stages`, {}),
    resetStages: (id: number) =>
      api.post<{ ok: boolean }>(`/api/debug/chicken/${id}/reset-stages`, {}),
  }
}
