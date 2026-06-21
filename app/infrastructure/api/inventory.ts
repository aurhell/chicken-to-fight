import { useApiClient } from "./client"

export type InventoryResponse = {
  items: Record<string, number>
}

export function useInventoryApi() {
  const api = useApiClient()

  return {
    fetchInventory: () => api.get<InventoryResponse>("/api/inventory"),
  }
}
