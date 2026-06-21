import { ref } from "vue"

import { useAuthStore } from "~/application/auth/useAuthStore"
import { useChickenApi, type ChickStatus, type EggStatus } from "~/infrastructure/api/chicken"

import type { HatchOutcome } from "~/domain/chicken/HatchOutcome"

export function useIncubation() {
  const api = useChickenApi()
  const auth = useAuthStore()

  const egg = ref<EggStatus | null>(null)
  const chick = ref<ChickStatus | null>(null)
  const loading = ref(true)
  const outcome = ref<HatchOutcome | null>(null)

  async function fetchStatus() {
    loading.value = true
    try {
      const data = await api.fetchStatus()
      egg.value = data.egg
      chick.value = data.chick
    } finally {
      loading.value = false
    }
  }

  function onAdopted(newEgg: EggStatus) {
    egg.value = newEgg
    auth.fetchMe()
  }

  function onOutcome(result: HatchOutcome) {
    egg.value = null
    outcome.value = result
    auth.fetchMe()
  }

  function dismissOutcome() {
    outcome.value = null
    fetchStatus()
  }

  async function onSold() {
    chick.value = null
    await auth.fetchMe()
  }

  return {
    egg,
    chick,
    loading,
    outcome,
    fetchStatus,
    onAdopted,
    onOutcome,
    dismissOutcome,
    onSold,
  }
}
