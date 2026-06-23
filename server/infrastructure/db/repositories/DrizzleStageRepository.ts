import { eq } from "drizzle-orm"

import { db } from "../index"
import { chickenStages } from "../schema"

import type { IStageRepository, StageRecord } from "../../../domain/chicken/repositories/IStageRepository"

export class DrizzleStageRepository implements IStageRepository {
  async findByChickenId(chickenId: number): Promise<StageRecord[]> {
    const rows = await db.select().from(chickenStages).where(eq(chickenStages.chickenId, chickenId))
    return rows.map(r => ({
      chickenId: r.chickenId,
      stageId: r.stageId,
      startedAt: r.startedAt,
    }))
  }

  async start(chickenId: number, stageId: string, now: Date): Promise<StageRecord> {
    const [row] = await db
      .insert(chickenStages)
      .values({
        chickenId,
        stageId,
        startedAt: now, 
      })
      .returning()
    if (!row) throw new Error("Failed to start stage")
    return {
      chickenId: row.chickenId,
      stageId: row.stageId,
      startedAt: row.startedAt, 
    }
  }
}
