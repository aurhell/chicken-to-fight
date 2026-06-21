import { useApiClient } from "./client"

export type EggStatus = {
  id: number
  name: string
  hatchAt: string
  humidityOk: boolean
  temperatureOk: boolean
  turnedOk: boolean
}

export type CareAction = "humidity" | "temperature" | "turn"

export type CareResult = {
  humidityOk: boolean
  temperatureOk: boolean
  turnedOk: boolean
}

export type HatchResult = {
  result: "hatched" | "lost"
}

export type ChickStatus = {
  id: number
  name: string
}

export type AdoptResult = {
  chicken: EggStatus
  gold: number
}

export type SellResult = {
  gold: number
}

export function useChickenApi() {
  const api = useApiClient()

  return {
    fetchStatus: () =>
      api.get<{ egg: EggStatus | null; chick: ChickStatus | null }>("/api/chicken/status"),
    adopt: (name: string) =>
      api.post<AdoptResult>("/api/chicken/adopt", { name }),
    care: (id: number, action: CareAction) =>
      api.post<CareResult>(`/api/chicken/${id}/care`, { action }),
    hatch: (id: number) =>
      api.post<HatchResult>(`/api/chicken/${id}/hatch`, {}),
    sell: (id: number) =>
      api.post<SellResult>(`/api/chicken/${id}/sell`, {}),
  }
}
