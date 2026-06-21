import { CARE_DRIFT_H, CHICK_GROWTH_DAYS, HUNGER_DRAIN_H, INCUBATION_DURATION_H, THIRST_DRAIN_H } from "#shared/chicken/ChickenConstants"
import { CHICKEN_LEVELS, type ChickenLevel } from "#shared/chicken/ChickenLevel"

import { ChickenStats } from "../value-objects/ChickenStats"
import { XPLevel } from "../value-objects/XPLevel"

export { CHICKEN_LEVELS, type ChickenLevel } from "#shared/chicken/ChickenLevel"
export { INCUBATION_DURATION_H, CARE_DRIFT_H, EGG_ADOPTION_COST, CHICKEN_SELL_PRICE, CHICK_GROWTH_DAYS, HUNGER_DRAIN_H, THIRST_DRAIN_H } from "#shared/chicken/ChickenConstants"
export { CHICKEN_SELL_PRICES } from "#shared/chicken/SellPrice"

const MS_PER_HOUR = 3_600_000
const MS_PER_DAY = 24 * MS_PER_HOUR

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
    public readonly fedAt: Date | null,
    public readonly wateredAt: Date | null,
    public readonly humidityAdjustedAt: Date,
    public readonly temperatureAdjustedAt: Date,
    public readonly turnedAt: Date,
  ) {}

  // --- Egg care ---

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
      this.fedAt, this.wateredAt,
      action === "humidity" ? now : this.humidityAdjustedAt,
      action === "temperature" ? now : this.temperatureAdjustedAt,
      action === "turn" ? now : this.turnedAt,
    )
  }

  // --- Chick care ---

  hungerPct(now = new Date()): number {
    if (!this.fedAt) return 0
    const elapsed = now.getTime() - this.fedAt.getTime()
    return Math.max(0, Math.min(1, 1 - elapsed / (HUNGER_DRAIN_H * MS_PER_HOUR)))
  }

  thirstPct(now = new Date()): number {
    if (!this.wateredAt) return 0
    const elapsed = now.getTime() - this.wateredAt.getTime()
    return Math.max(0, Math.min(1, 1 - elapsed / (THIRST_DRAIN_H * MS_PER_HOUR)))
  }

  isDead(now = new Date()): boolean {
    return this.level === CHICKEN_LEVELS.CHICK
      && (this.hungerPct(now) <= 0 || this.thirstPct(now) <= 0)
  }

  feed(now = new Date()): Chicken {
    return new Chicken(
      this.id, this.userId, this.name, this.level, this.xp, this.stats, this.hatchAt,
      now, this.wateredAt,
      this.humidityAdjustedAt, this.temperatureAdjustedAt, this.turnedAt,
    )
  }

  water(now = new Date()): Chicken {
    return new Chicken(
      this.id, this.userId, this.name, this.level, this.xp, this.stats, this.hatchAt,
      this.fedAt, now,
      this.humidityAdjustedAt, this.temperatureAdjustedAt, this.turnedAt,
    )
  }

  // --- Growth ---

  isReadyToGrow(now = new Date()): boolean {
    return this.level === CHICKEN_LEVELS.CHICK
      && this.hatchAt !== null
      && now.getTime() >= this.hatchAt.getTime() + CHICK_GROWTH_DAYS * MS_PER_DAY
  }

  grow(): Chicken {
    return new Chicken(
      this.id, this.userId, this.name, CHICKEN_LEVELS.ADOLESCENT,
      this.xp, this.stats, this.hatchAt,
      this.fedAt, this.wateredAt,
      this.humidityAdjustedAt, this.temperatureAdjustedAt, this.turnedAt,
    )
  }

  // --- Combat (future use) ---

  gainXP(amount: number): Chicken {
    return new Chicken(
      this.id, this.userId, this.name, this.level,
      this.xp.add(amount), this.stats, this.hatchAt,
      this.fedAt, this.wateredAt,
      this.humidityAdjustedAt, this.temperatureAdjustedAt, this.turnedAt,
    )
  }
}

export function createEgg(userId: number, name: string, now = new Date()): Omit<Chicken, "id"> & { id: 0 } {
  const hatchAt = new Date(now.getTime() + INCUBATION_DURATION_H * MS_PER_HOUR)
  return new Chicken(
    0, userId, name, CHICKEN_LEVELS.EGG,
    new XPLevel(0), new ChickenStats(100, 100, 100, 0),
    hatchAt, null, null,
    now, now, now,
  ) as Chicken & { id: 0 }
}
