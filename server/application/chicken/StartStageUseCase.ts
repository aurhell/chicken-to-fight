import { ALL_STAGE_IDS, STAGE_DURATION_H, type StageId } from "#shared/chicken/Stage"

import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"

import type { IChickenRepository } from "../../domain/chicken/repositories/IChickenRepository"
import type { IStageRepository } from "../../domain/chicken/repositories/IStageRepository"

const MS_PER_HOUR = 3_600_000

export type StartStageInput = {
  userId: number
  chickenId: number
  stageId: string
}

export type StartStageResult = {
  stageId: string
  startedAt: Date
  completesAt: Date
}

function isCompleted(startedAt: Date, stageId: StageId, now: Date): boolean {
  const durationMs = STAGE_DURATION_H[stageId] * MS_PER_HOUR
  return now.getTime() >= startedAt.getTime() + durationMs
}

export class StartStageUseCase {
  constructor(
    private readonly chickens: IChickenRepository,
    private readonly stages: IStageRepository,
  ) {}

  async execute(input: StartStageInput, now = new Date()): Promise<StartStageResult> {
    if (!ALL_STAGE_IDS.includes(input.stageId as StageId)) throw new Error("Unknown stage")

    const chicken = await this.chickens.findById(input.chickenId)
    if (!chicken) throw new Error("Chicken not found")
    if (chicken.userId !== input.userId) throw new Error("Not your chicken")
    if (chicken.level !== CHICKEN_LEVELS.ADOLESCENT) throw new Error("Not an adolescent")

    const records = await this.stages.findByChickenId(input.chickenId)

    const existing = records.find(r => r.stageId === input.stageId)
    if (existing && isCompleted(existing.startedAt, input.stageId as StageId, now)) {
      throw new Error("Stage already completed")
    }

    const anyInProgress = records.some(r => !isCompleted(r.startedAt, r.stageId as StageId, now))
    if (anyInProgress) throw new Error("A stage is already in progress")

    const record = await this.stages.start(input.chickenId, input.stageId, now)
    const durationMs = STAGE_DURATION_H[input.stageId as StageId] * MS_PER_HOUR
    return {
      stageId: record.stageId,
      startedAt: record.startedAt,
      completesAt: new Date(record.startedAt.getTime() + durationMs),
    }
  }
}
