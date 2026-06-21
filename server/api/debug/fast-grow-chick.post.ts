import { Chicken, CHICKEN_LEVELS, CHICK_GROWTH_DAYS } from "../../domain/chicken/entities/Chicken"
import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../infrastructure/db/repositories/DrizzleChickenRepository"

const MS_PER_DAY = 86_400_000

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const repo = new DrizzleChickenRepository()
  const all = await repo.findByUserId(userId)
  const chick = all.find(c => c.level === CHICKEN_LEVELS.CHICK)
  if (!chick) throw createError({
    statusCode: 404,
    message: "No chick found",
  })

  const threeDaysAgo = new Date(Date.now() - (CHICK_GROWTH_DAYS * MS_PER_DAY + 1_000))
  const advanced = new Chicken(
    chick.id, chick.userId, chick.name, chick.level,
    chick.xp, chick.stats, threeDaysAgo,
    chick.fedAt, chick.wateredAt,
    chick.humidityAdjustedAt, chick.temperatureAdjustedAt, chick.turnedAt,
  )
  await repo.save(advanced)

  return { ok: true }
})
