import { and, eq } from "drizzle-orm"

import { CHICKEN_LEVELS } from "../../../../domain/chicken/entities/Chicken"
import { requireAuth } from "../../../../infrastructure/auth/session"
import { db } from "../../../../infrastructure/db/index"
import { chickenStages, chickens } from "../../../../infrastructure/db/schema"

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

  await db.delete(chickenStages).where(eq(chickenStages.chickenId, chickenId))

  return { ok: true }
})
