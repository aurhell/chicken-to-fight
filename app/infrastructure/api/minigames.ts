import { useApiClient } from "./client"

import type { PlayResult } from "~/domain/minigames/PlayResult"

export function useMinigamesApi() {
  const api = useApiClient()

  return {
    fetchGratChickenStatus: () =>
      api.get<{ playsRemaining: number }>("/api/minigames/gratchicken/status"),
    playGratChicken: () =>
      api.post<PlayResult>("/api/minigames/gratchicken/play", {}),
  }
}
