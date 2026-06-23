import { STAGES_REQUIRED, STAGE_DURATION_H, type StageId } from "#shared/chicken/Stage"

import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"

import type { IChickenRepository } from "../../domain/chicken/repositories/IChickenRepository"
import type { IStageRepository } from "../../domain/chicken/repositories/IStageRepository"

const MS_PER_HOUR = 3_600_000

export type GraduateAdolescentInput = {
  userId: number
  chickenId: number
}

export type GraduateAdolescentResult = {
  level: number
}

export class GraduateAdolescentUseCase {
  constructor(
    private readonly chickens: IChickenRepository,
    private readonly stages: IStageRepository,
  ) {}

  async execute(input: GraduateAdolescentInput, now = new Date()): Promise<GraduateAdolescentResult> {
    const chicken = await this.chickens.findById(input.chickenId)
    if (!chicken) throw new Error("Chicken not found")
    if (chicken.userId !== input.userId) throw new Error("Not your chicken")
    if (chicken.level !== CHICKEN_LEVELS.ADOLESCENT) throw new Error("Not an adolescent")

    const records = await this.stages.findByChickenId(input.chickenId)
    const completedCount = records.filter(r => {
      const durationMs = STAGE_DURATION_H[r.stageId as StageId] * MS_PER_HOUR
      return now.getTime() >= r.startedAt.getTime() + durationMs
    }).length

    if (completedCount < STAGES_REQUIRED) throw new Error("Not enough stages completed")

    const graduated = chicken.graduate()
    await this.chickens.save(graduated)
    return { level: graduated.level }
  }
}
