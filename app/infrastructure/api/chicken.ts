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

export type StageInfo = {
  stageId: string
  status: "not_started" | "in_progress" | "completed"
  startedAt: string | null
  completesAt: string | null
}

export type StartStageResult = {
  stageId: string
  startedAt: string
  completesAt: string
}

export type GraduateResult = {
  level: number
}

export type ChooseJobResult = {
  jobId: string
  dailyIncome: number
}

export type CollectSalaryResult = {
  goldEarned: number
  newGold: number
}

export type ChickStatus = {
  id: number
  name: string
  level: number
  xp: number
  bornAt: string | null
  fedAt: string | null
  wateredAt: string | null
  stages: StageInfo[]
  canGraduate: boolean
  jobId: string | null
  lastSalaryAt: string | null
  canCollectSalary: boolean
}

export type Resources = {
  water: number
  flour: number
}

export type StatusResponse = {
  eggs: EggStatus[]
  chicks: ChickStatus[]
  chickenDied: boolean
  resources: Resources
}

export type AdoptResult = {
  chicken: EggStatus
  gold: number
}

export type SellResult = {
  gold: number
}

export type FeedResult = {
  fedAt: string
  flour: number
}

export type WaterResult = {
  wateredAt: string
  water: number
}

export function useChickenApi() {
  const api = useApiClient()

  return {
    fetchStatus: () => api.get<StatusResponse>("/api/chicken/status"),
    adopt: (name: string) =>
      api.post<AdoptResult>("/api/chicken/adopt", { name }),
    care: (id: number, action: CareAction) =>
      api.post<CareResult>(`/api/chicken/${id}/care`, { action }),
    hatch: (id: number) =>
      api.post<HatchResult>(`/api/chicken/${id}/hatch`, {}),
    sell: (id: number) =>
      api.post<SellResult>(`/api/chicken/${id}/sell`, {}),
    feed: (id: number) =>
      api.post<FeedResult>(`/api/chicken/${id}/feed`, {}),
    water: (id: number) =>
      api.post<WaterResult>(`/api/chicken/${id}/water`, {}),
    startStage: (id: number, stageId: string) =>
      api.post<StartStageResult>(`/api/chicken/${id}/stage/start`, { stageId }),
    graduate: (id: number) =>
      api.post<GraduateResult>(`/api/chicken/${id}/graduate`, {}),
    chooseJob: (id: number, jobId: string) =>
      api.post<ChooseJobResult>(`/api/chicken/${id}/job`, { jobId }),
    collectSalary: (id: number) =>
      api.post<CollectSalaryResult>(`/api/chicken/${id}/collect-salary`, {}),
  }
}
