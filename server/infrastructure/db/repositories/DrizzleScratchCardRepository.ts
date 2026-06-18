import { and, eq, gte, sql } from "drizzle-orm"

import { db } from "../index"
import { scratchCardPlays } from "../schema"

import type { Grid } from "../../../domain/minigames/entities/ScratchCard"
import type { IScratchCardRepository } from "../../../domain/minigames/repositories/IScratchCardRepository"

export class DrizzleScratchCardRepository implements IScratchCardRepository {
  async countTodayPlays(userId: number): Promise<number> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(scratchCardPlays)
      .where(and(
        eq(scratchCardPlays.userId, userId),
        gte(scratchCardPlays.playedAt, today),
      ))

    return result[0]?.count ?? 0
  }

  async save(data: { userId: number; grid: Grid; won: boolean }): Promise<void> {
    await db.insert(scratchCardPlays).values({
      userId: data.userId,
      grid: data.grid,
      won: data.won,
    })
  }
}
