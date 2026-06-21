import { ref } from "vue"

import { useAuthStore } from "~/application/auth/useAuthStore"
import { useChickenApi, type ChickStatus, type EggStatus, type Resources } from "~/infrastructure/api/chicken"

import type { HatchOutcome } from "~/domain/chicken/HatchOutcome"

export function useIncubation() {
  const api = useChickenApi()
  const auth = useAuthStore()

  const egg = ref<EggStatus | null>(null)
  const chick = ref<ChickStatus | null>(null)
  const resources = ref<Resources>({
    water: 0,
    flour: 0, 
  })
  const loading = ref(true)
  const outcome = ref<HatchOutcome | null>(null)
  const chickenDied = ref(false)

  async function fetchStatus() {
    loading.value = true
    try {
      const data = await api.fetchStatus()
      egg.value = data.egg
      chick.value = data.chick
      resources.value = data.resources
      if (data.chickenDied) chickenDied.value = true
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

  function dismissDeath() {
    chickenDied.value = false
  }

  async function onSold() {
    chick.value = null
    await auth.fetchMe()
  }

  function onFed(fedAt: string, flour: number) {
    if (chick.value) chick.value = {
      ...chick.value,
      fedAt, 
    }
    resources.value = {
      ...resources.value,
      flour, 
    }
  }

  function onWatered(wateredAt: string, water: number) {
    if (chick.value) chick.value = {
      ...chick.value,
      wateredAt, 
    }
    resources.value = {
      ...resources.value,
      water, 
    }
  }

  return {
    egg,
    chick,
    resources,
    loading,
    outcome,
    chickenDied,
    fetchStatus,
    onAdopted,
    onOutcome,
    dismissOutcome,
    dismissDeath,
    onSold,
    onFed,
    onWatered,
  }
}
