import { ref } from "vue"

import { SHOP_ITEMS_FOOD } from "#shared/economy/ShopItem"
import { useAuthStore } from "~/application/auth/useAuthStore"
import { useShopApi } from "~/infrastructure/api/shop"

export function useShop() {
  const api = useShopApi()
  const auth = useAuthStore()
  const buying = ref<string | null>(null)
  const error = ref<string | null>(null)

  async function buy(itemId: string) {
    buying.value = itemId
    error.value = null
    try {
      const result = await api.buy(itemId)
      await auth.fetchMe()
      return result
    } catch(e) {
      error.value = e instanceof Error ? e.message : "Erreur"
      throw e
    } finally {
      buying.value = null
    }
  }

  return {
    items: SHOP_ITEMS_FOOD,
    buying,
    error,
    buy,
  }
}
