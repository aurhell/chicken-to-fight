import { eq } from "drizzle-orm"

import { Chicken, CHICKEN_LEVELS, type ChickenLevel  } from "../../../domain/chicken/entities/Chicken"
import { ChickenStats } from "../../../domain/chicken/value-objects/ChickenStats"
import { XPLevel } from "../../../domain/chicken/value-objects/XPLevel"
import { db } from "../index"
import { chickens } from "../schema"

import type { CreateChickenData, IChickenRepository } from "../../../domain/chicken/repositories/IChickenRepository"

type ChickenRow = typeof chickens.$inferSelect

export class DrizzleChickenRepository implements IChickenRepository {
  async findById(id: number): Promise<Chicken | null> {
    const [row] = await db.select().from(chickens).where(eq(chickens.id, id))
    return row ? this.toEntity(row) : null
  }

  async findByUserId(userId: number): Promise<Chicken[]> {
    const rows = await db.select().from(chickens).where(eq(chickens.userId, userId))
    return rows.map(r => this.toEntity(r))
  }

  async create(data: CreateChickenData): Promise<Chicken> {
    const [row] = await db.insert(chickens).values({
      userId: data.userId,
      name: data.name,
      level: data.level,
      xp: data.xp.value,
      hunger: data.stats.hunger,
      thirst: data.stats.thirst,
      happiness: data.stats.happiness,
      fatigue: data.stats.fatigue,
      hatchAt: data.hatchAt,
      fedAt: data.fedAt,
      wateredAt: data.wateredAt,
      humidityAdjustedAt: data.humidityAdjustedAt,
      temperatureAdjustedAt: data.temperatureAdjustedAt,
      turnedAt: data.turnedAt,
    }).returning()
    if (!row) throw new Error("Failed to create chicken")
    return this.toEntity(row)
  }

  async save(chicken: Chicken): Promise<Chicken> {
    const [row] = await db.update(chickens).set({
      name: chicken.name,
      level: chicken.level,
      xp: chicken.xp.value,
      hunger: chicken.stats.hunger,
      thirst: chicken.stats.thirst,
      happiness: chicken.stats.happiness,
      fatigue: chicken.stats.fatigue,
      hatchAt: chicken.hatchAt,
      fedAt: chicken.fedAt,
      wateredAt: chicken.wateredAt,
      humidityAdjustedAt: chicken.humidityAdjustedAt,
      temperatureAdjustedAt: chicken.temperatureAdjustedAt,
      turnedAt: chicken.turnedAt,
    }).where(eq(chickens.id, chicken.id)).returning()
    if (!row) throw new Error("Failed to save chicken")
    return this.toEntity(row)
  }

  async delete(id: number): Promise<void> {
    await db.delete(chickens).where(eq(chickens.id, id))
  }

  private toEntity(row: ChickenRow): Chicken {
    return new Chicken(
      row.id,
      row.userId,
      row.name,
      row.level as ChickenLevel,
      new XPLevel(row.xp),
      new ChickenStats(row.hunger, row.thirst, row.happiness, row.fatigue),
      row.hatchAt,
      row.fedAt,
      row.wateredAt,
      row.humidityAdjustedAt,
      row.temperatureAdjustedAt,
      row.turnedAt,
    )
  }
}
