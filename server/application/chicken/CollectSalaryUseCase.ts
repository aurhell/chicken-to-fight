import { JOB_DAILY_INCOME, type JobId } from "#shared/chicken/Job"

import type { IChickenRepository } from "../../domain/chicken/repositories/IChickenRepository"
import type { IUserRepository } from "../../domain/user/repositories/IUserRepository"

export type CollectSalaryInput = {
  userId: number
  chickenId: number
}

export type CollectSalaryResult = {
  goldEarned: number
  newGold: number
}

export class CollectSalaryUseCase {
  constructor(
    private readonly chickens: IChickenRepository,
    private readonly users: IUserRepository,
  ) {}

  async execute(input: CollectSalaryInput, now = new Date()): Promise<CollectSalaryResult> {
    const chicken = await this.chickens.findById(input.chickenId)
    if (!chicken) throw new Error("Chicken not found")
    if (chicken.userId !== input.userId) throw new Error("Not your chicken")
    if (!chicken.jobId) throw new Error("Chicken has no job")
    if (!chicken.canCollectSalary(now)) throw new Error("Salary already collected today")

    const dailyIncome = JOB_DAILY_INCOME[chicken.jobId as JobId]
    const updatedUser = await this.users.addGold(input.userId, dailyIncome)
    await this.chickens.save(chicken.collectSalary(now))

    return {
      goldEarned: dailyIncome,
      newGold: updatedUser.gold,
    }
  }
}
