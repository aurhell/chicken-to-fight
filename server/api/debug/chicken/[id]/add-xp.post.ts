import { createError } from "h3"

import { CHICKEN_LEVELS } from "../../../../domain/chicken/entities/Chicken"
import { requireAuth } from "../../../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../../../infrastructure/db/repositories/DrizzleChickenRepository"

const XP_TO_ADD = 1_000

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenId = Number(event.context.params?.id)
  const chickenRepo = new DrizzleChickenRepository()

  const chicken = await chickenRepo.findById(chickenId)
  if (!chicken) throw createError({
    statusCode: 404,
    message: "Chicken not found", 
  })
  if (chicken.userId !== userId) throw createError({
    statusCode: 403,
    message: "Not your chicken", 
  })
  if (chicken.level !== CHICKEN_LEVELS.APPRENTICE) throw createError({
    statusCode: 400,
    message: "Chicken must be APPRENTICE level", 
  })

  const updated = await chickenRepo.save(chicken.gainXP(XP_TO_ADD))
  return { xp: updated.xp.value }
})
