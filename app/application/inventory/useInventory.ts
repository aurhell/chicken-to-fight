import { ref } from "vue"

import { useInventoryApi } from "~/infrastructure/api/inventory"

export function useInventory() {
  const api = useInventoryApi()

  const items = ref<Record<string, number>>({})
  const loading = ref(true)

  async function fetchInventory() {
    loading.value = true
    try {
      const data = await api.fetchInventory()
      items.value = data.items
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    fetchInventory,
  }
}
