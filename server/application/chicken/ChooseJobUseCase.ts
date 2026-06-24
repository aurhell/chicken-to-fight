import { ALL_JOB_IDS, JOB_COST, JOB_DAILY_INCOME, XP_FOR_JOB, type JobId } from "#shared/chicken/Job"

import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"

import type { IChickenRepository } from "../../domain/chicken/repositories/IChickenRepository"
import type { IUserRepository } from "../../domain/user/repositories/IUserRepository"

export type ChooseJobInput = {
  userId: number
  chickenId: number
  jobId: JobId
}

export type ChooseJobResult = {
  jobId: JobId
  dailyIncome: number
}

export class ChooseJobUseCase {
  constructor(
    private readonly chickens: IChickenRepository,
    private readonly users: IUserRepository,
  ) {}

  async execute(input: ChooseJobInput, _now = new Date()): Promise<ChooseJobResult> {
    if (!ALL_JOB_IDS.includes(input.jobId)) throw new Error("Invalid job")

    const chicken = await this.chickens.findById(input.chickenId)
    if (!chicken) throw new Error("Chicken not found")
    if (chicken.userId !== input.userId) throw new Error("Not your chicken")
    if (chicken.level !== CHICKEN_LEVELS.APPRENTICE) throw new Error("Chicken must be APPRENTICE level")
    if (chicken.jobId !== null) throw new Error("Chicken already has a job")
    if (chicken.xp.value < XP_FOR_JOB) throw new Error("Not enough XP")

    const cost = JOB_COST[input.jobId]
    if (cost > 0) {
      const user = await this.users.findById(input.userId)
      if (!user) throw new Error("User not found")
      if (user.gold < cost) throw new Error("Not enough gold")
      await this.users.addGold(input.userId, -cost)
    }

    await this.chickens.save(chicken.chooseJob(input.jobId))

    return {
      jobId: input.jobId,
      dailyIncome: JOB_DAILY_INCOME[input.jobId],
    }
  }
}
