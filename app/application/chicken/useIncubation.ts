import { ref } from "vue"

import { useAuthStore } from "~/application/auth/useAuthStore"
import { useChickenApi, type ChickStatus, type EggStatus, type Resources } from "~/infrastructure/api/chicken"

import type { HatchOutcome } from "~/domain/chicken/HatchOutcome"

export function useIncubation() {
  const api = useChickenApi()
  const auth = useAuthStore()

  const eggs = ref<EggStatus[]>([])
  const chicks = ref<ChickStatus[]>([])
  const resources = ref<Resources>({
    water: 0,
    flour: 0,
  })
  const loading = ref(true)
  const outcome = ref<HatchOutcome | null>(null)
  const chickenDied = ref(false)
  const graduatedName = ref<string | null>(null)

  async function fetchStatus() {
    loading.value = true
    try {
      const data = await api.fetchStatus()
      eggs.value = data.eggs
      chicks.value = data.chicks
      resources.value = data.resources
      if (data.chickenDied) chickenDied.value = true
    } finally {
      loading.value = false
    }
  }

  function onAdopted(newEgg: EggStatus) {
    eggs.value = [
      ...eggs.value,
      newEgg,
    ]
    auth.fetchMe()
  }

  function onOutcome(result: HatchOutcome) {
    outcome.value = result
    fetchStatus()
    auth.fetchMe()
  }

  function dismissOutcome() {
    outcome.value = null
  }

  function dismissDeath() {
    chickenDied.value = false
  }

  async function onSold() {
    await fetchStatus()
    await auth.fetchMe()
  }

  function onFed(chickenId: number, fedAt: string, flour: number) {
    const idx = chicks.value.findIndex(c => c.id === chickenId)
    if (idx !== -1) {
      chicks.value = chicks.value.map((c, i) => i === idx ? {
        ...c,
        fedAt,
      } : c)
    }
    resources.value = {
      ...resources.value,
      flour,
    }
  }

  function onWatered(chickenId: number, wateredAt: string, water: number) {
    const idx = chicks.value.findIndex(c => c.id === chickenId)
    if (idx !== -1) {
      chicks.value = chicks.value.map((c, i) => i === idx ? {
        ...c,
        wateredAt,
      } : c)
    }
    resources.value = {
      ...resources.value,
      water,
    }
  }

  function onStageStarted(chickenId: number, stageId: string, startedAt: string, completesAt: string) {
    const idx = chicks.value.findIndex(c => c.id === chickenId)
    if (idx !== -1) {
      chicks.value = chicks.value.map((c, i) => {
        if (i !== idx) return c
        const stages = c.stages.map(s =>
          s.stageId === stageId
            ? {
              ...s,
              status: "in_progress" as const,
              startedAt,
              completesAt,
            }
            : s,
        )
        const alreadyHas = c.stages.some(s => s.stageId === stageId)
        return {
          ...c,
          stages: alreadyHas ? stages : [
            ...stages,
            {
              stageId,
              status: "in_progress" as const,
              startedAt,
              completesAt,
            },
          ],
        }
      })
    }
  }

  async function onGraduated(_id: number, name: string) {
    graduatedName.value = name
    await fetchStatus()
  }

  function dismissGraduation() {
    graduatedName.value = null
  }

  async function onJobChosen(chickenId: number, jobId: string) {
    chicks.value = chicks.value.map(c =>
      c.id === chickenId ? {
        ...c,
        jobId, 
      } : c,
    )
    await auth.fetchMe()
  }

  async function onSalaryCollected(chickenId: number) {
    await fetchStatus()
    await auth.fetchMe()
    void chickenId
  }

  return {
    eggs,
    chicks,
    resources,
    loading,
    outcome,
    chickenDied,
    graduatedName,
    fetchStatus,
    onAdopted,
    onOutcome,
    dismissOutcome,
    dismissDeath,
    dismissGraduation,
    onSold,
    onFed,
    onWatered,
    onStageStarted,
    onGraduated,
    onJobChosen,
    onSalaryCollected,
  }
}
