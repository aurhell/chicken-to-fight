import { useApiClient } from "./client"

export type BuyResult = {
  gold: number
  quantity: number
}

export function useShopApi() {
  const api = useApiClient()
  return {
    buy: (itemId: string) => api.post<BuyResult>("/api/shop/buy", { itemId }),
  }
}
