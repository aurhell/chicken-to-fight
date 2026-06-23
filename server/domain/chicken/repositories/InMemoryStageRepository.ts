import type { IStageRepository, StageRecord } from "./IStageRepository"

export class InMemoryStageRepository implements IStageRepository {
  private store = new Map<string, StageRecord>()

  private key(chickenId: number, stageId: string): string {
    return `${chickenId}:${stageId}`
  }

  async findByChickenId(chickenId: number): Promise<StageRecord[]> {
    return [...this.store.values()].filter(r => r.chickenId === chickenId)
  }

  async start(chickenId: number, stageId: string, now: Date): Promise<StageRecord> {
    const record: StageRecord = {
      chickenId,
      stageId,
      startedAt: now, 
    }
    this.store.set(this.key(chickenId, stageId), record)
    return record
  }
}
