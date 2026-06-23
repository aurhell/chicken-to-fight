import { eq, and } from "drizzle-orm"

import { ALL_STAGE_IDS, STAGES_REQUIRED } from "#shared/chicken/Stage"

import { CHICKEN_LEVELS } from "../../../../domain/chicken/entities/Chicken"
import { requireAuth } from "../../../../infrastructure/auth/session"
import { db } from "../../../../infrastructure/db/index"
import { chickenStages, chickens } from "../../../../infrastructure/db/schema"

const MS_PER_DAY = 86_400_000
const COMPLETION_DAYS_AGO = 3

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenId = Number(getRouterParam(event, "id"))

  const [chicken] = await db
    .select()
    .from(chickens)
    .where(and(eq(chickens.id, chickenId), eq(chickens.userId, userId)))
  if (!chicken) throw createError({
    statusCode: 404,
    message: "Chicken not found", 
  })
  if (chicken.level !== CHICKEN_LEVELS.ADOLESCENT) {
    throw createError({
      statusCode: 422,
      message: "Not an adolescent", 
    })
  }

  const startedAt = new Date(Date.now() - COMPLETION_DAYS_AGO * MS_PER_DAY)
  const stagesToComplete = ALL_STAGE_IDS.slice(0, STAGES_REQUIRED)

  for (const stageId of stagesToComplete) {
    await db
      .insert(chickenStages)
      .values({
        chickenId,
        stageId,
        startedAt, 
      })
      .onConflictDoUpdate({
        target: [
          chickenStages.chickenId,
          chickenStages.stageId,
        ],
        set: { startedAt },
      })
  }

  return { ok: true }
})
