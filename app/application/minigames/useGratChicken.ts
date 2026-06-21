import { ref } from "vue"

import { useAuthStore } from "~/application/auth/useAuthStore"
import { useMinigamesApi } from "~/infrastructure/api/minigames"

export type GameState = "idle" | "playing" | "won" | "lost"

export function useGratChicken() {
  const api = useMinigamesApi()
  const auth = useAuthStore()

  const state = ref<GameState>("idle")
  const playsRemaining = ref(0)
  const activeGrid = ref<string[] | null>(null)
  const loading = ref(false)
  const errorKey = ref<string | null>(null)

  async function fetchStatus() {
    const data = await api.fetchGratChickenStatus()
    playsRemaining.value = data.playsRemaining
  }

  async function play() {
    if (loading.value) return
    loading.value = true
    errorKey.value = null
    try {
      const result = await api.playGratChicken()
      activeGrid.value = result.grid
      playsRemaining.value = result.playsRemaining
      state.value = "playing"
    } catch(e) {
      errorKey.value = e instanceof Error ? e.message : "Play failed"
    } finally {
      loading.value = false
    }
  }

  function onCardCompleted(won: boolean) {
    state.value = won ? "won" : "lost"
    if (won) auth.fetchMe()
  }

  function reset() {
    state.value = "idle"
    activeGrid.value = null
  }

  return {
    state,
    playsRemaining,
    activeGrid,
    loading,
    errorKey,
    fetchStatus,
    play,
    onCardCompleted,
    reset, 
  }
}
