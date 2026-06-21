import { CHICKEN_LEVELS, HUNGER_DRAIN_H, THIRST_DRAIN_H } from "../../domain/chicken/entities/Chicken"
import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../infrastructure/db/repositories/DrizzleChickenRepository"

const MS_PER_HOUR = 3_600_000

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const repo = new DrizzleChickenRepository()
  const all = await repo.findByUserId(userId)
  const chick = all.find(c => c.level === CHICKEN_LEVELS.CHICK)
  if (!chick) throw createError({
    statusCode: 404,
    message: "No chick found",
  })

  const now = Date.now()
  const hungryAt = new Date(now - (HUNGER_DRAIN_H + 1) * MS_PER_HOUR)
  const thirstyAt = new Date(now - (THIRST_DRAIN_H + 1) * MS_PER_HOUR)
  const drained = chick.feed(hungryAt).water(thirstyAt)
  await repo.save(drained)

  return { ok: true }
})
