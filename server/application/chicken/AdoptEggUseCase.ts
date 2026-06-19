import { CHICKEN_LEVELS, EGG_ADOPTION_COST, INCUBATION_DURATION_H, type Chicken  } from "../../domain/chicken/entities/Chicken"
import { ChickenStats } from "../../domain/chicken/value-objects/ChickenStats"
import { XPLevel } from "../../domain/chicken/value-objects/XPLevel"

import type { IChickenRepository } from "../../domain/chicken/repositories/IChickenRepository"
import type { IUserRepository } from "../../domain/user/repositories/IUserRepository"

const MS_PER_HOUR = 3_600_000

const DEFAULT_STATS = new ChickenStats(100, 100, 100, 0)

export type AdoptEggInput = {
  userId: number
  name: string
}

export type AdoptEggResult = {
  chicken: Chicken
  gold: number
}

export class AdoptEggUseCase {
  constructor(
    private readonly chickens: IChickenRepository,
    private readonly users: IUserRepository,
  ) {}

  async execute(input: AdoptEggInput, now = new Date()): Promise<AdoptEggResult> {
    const user = await this.users.findById(input.userId)
    if (!user) throw new Error("User not found")
    if (user.gold < EGG_ADOPTION_COST) throw new Error("Not enough gold")

    const existing = await this.chickens.findByUserId(input.userId)
    if (existing.some(c => c.isEgg(now))) throw new Error("Already incubating an egg")

    const hatchAt = new Date(now.getTime() + INCUBATION_DURATION_H * MS_PER_HOUR)

    const chicken = await this.chickens.create({
      userId: input.userId,
      name: input.name,
      level: CHICKEN_LEVELS.EGG,
      xp: new XPLevel(0),
      stats: DEFAULT_STATS,
      hatchAt,
      humidityAdjustedAt: now,
      temperatureAdjustedAt: now,
      turnedAt: now,
    })

    const updatedUser = await this.users.addGold(input.userId, -EGG_ADOPTION_COST)

    return {
      chicken,
      gold: updatedUser.gold, 
    }
  }
}
