import { ChickenStats } from "../value-objects/ChickenStats"
import { XPLevel } from "../value-objects/XPLevel"

const MS_PER_HOUR = 3_600_000

export const INCUBATION_DURATION_H = 48
export const CARE_DRIFT_H = 12
export const EGG_ADOPTION_COST = 30

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
export type CareAction = "humidity" | "temperature" | "turn"

export class Chicken {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly name: string,
    public readonly level: ChickenLevel,
    public readonly xp: XPLevel,
    public readonly stats: ChickenStats,
    public readonly hatchAt: Date | null,
    public readonly humidityAdjustedAt: Date,
    public readonly temperatureAdjustedAt: Date,
    public readonly turnedAt: Date,
  ) {}

  isEgg(now = new Date()): boolean {
    return this.level === CHICKEN_LEVELS.EGG && this.hatchAt !== null && this.hatchAt > now
  }

  isHatched(now = new Date()): boolean {
    return this.hatchAt === null || this.hatchAt <= now
  }

  isHumidityOk(now = new Date()): boolean {
    return this.humidityAdjustedAt.getTime() > now.getTime() - CARE_DRIFT_H * MS_PER_HOUR
  }

  isTemperatureOk(now = new Date()): boolean {
    return this.temperatureAdjustedAt.getTime() > now.getTime() - CARE_DRIFT_H * MS_PER_HOUR
  }

  isTurnedOk(now = new Date()): boolean {
    return this.turnedAt.getTime() > now.getTime() - CARE_DRIFT_H * MS_PER_HOUR
  }

  care(action: CareAction, now = new Date()): Chicken {
    return new Chicken(
      this.id, this.userId, this.name, this.level, this.xp, this.stats, this.hatchAt,
      action === "humidity" ? now : this.humidityAdjustedAt,
      action === "temperature" ? now : this.temperatureAdjustedAt,
      action === "turn" ? now : this.turnedAt,
    )
  }

  gainXP(amount: number): Chicken {
    return new Chicken(
      this.id, this.userId, this.name, this.level,
      this.xp.add(amount), this.stats, this.hatchAt,
      this.humidityAdjustedAt, this.temperatureAdjustedAt, this.turnedAt,
    )
  }
}

export function createEgg(userId: number, name: string, now = new Date()): Omit<Chicken, "id"> & { id: 0 } {
  const hatchAt = new Date(now.getTime() + INCUBATION_DURATION_H * MS_PER_HOUR)
  return new Chicken(
    0, userId, name, CHICKEN_LEVELS.EGG,
    new XPLevel(0), new ChickenStats(100, 100, 100, 0),
    hatchAt, now, now, now,
  ) as Chicken & { id: 0 }
}
