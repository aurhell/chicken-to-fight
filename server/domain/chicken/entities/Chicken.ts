import type { ChickenStats } from "../value-objects/ChickenStats"
import type { XPLevel } from "../value-objects/XPLevel"

export const CHICKEN_LEVELS = {
  EGG: 1,
  CHICK: 2,
  ADOLESCENT: 3,
  APPRENTICE: 4,
  CHAMPION: 5,
  MASTER: 6,
  LEGEND: 7,
  RETIRED: 8,
  IMMORTAL: 9,
} as const

export type ChickenLevel = typeof CHICKEN_LEVELS[keyof typeof CHICKEN_LEVELS]

export class Chicken {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly name: string,
    public readonly level: ChickenLevel,
    public readonly xp: XPLevel,
    public readonly stats: ChickenStats,
    public readonly hatchAt: Date | null,
  ) {}

  isEgg(): boolean {
    return this.hatchAt !== null && this.hatchAt > new Date()
  }

  isHatched(): boolean {
    return this.hatchAt === null || this.hatchAt <= new Date()
  }

  gainXP(amount: number): Chicken {
    return new Chicken(
      this.id, this.userId, this.name, this.level,
      this.xp.add(amount), this.stats, this.hatchAt,
    )
  }
}
