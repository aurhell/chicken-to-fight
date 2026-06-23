export type StageRecord = {
  chickenId: number
  stageId: string
  startedAt: Date
}

export type IStageRepository = {
  findByChickenId(chickenId: number): Promise<StageRecord[]>
  start(chickenId: number, stageId: string, now: Date): Promise<StageRecord>
}
