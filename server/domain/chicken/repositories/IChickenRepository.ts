import type { JobId } from "#shared/chicken/Job"
import type { Chicken, ChickenLevel } from "../entities/Chicken"
import type { ChickenStats } from "../value-objects/ChickenStats"
import type { XPLevel } from "../value-objects/XPLevel"

export type CreateChickenData = {
  userId: number
  name: string
  level: ChickenLevel
  xp: XPLevel
  stats: ChickenStats
  hatchAt: Date | null
  fedAt: Date | null
  wateredAt: Date | null
  humidityAdjustedAt: Date
  temperatureAdjustedAt: Date
  turnedAt: Date
  jobId?: JobId | null
  lastSalaryAt?: Date | null
}

export type IChickenRepository = {
  findById(id: number): Promise<Chicken | null>
  findByUserId(userId: number): Promise<Chicken[]>
  create(data: CreateChickenData): Promise<Chicken>
  save(chicken: Chicken): Promise<Chicken>
  delete(id: number): Promise<void>
}
