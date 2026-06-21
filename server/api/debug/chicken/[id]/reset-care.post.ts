import { getRouterParam } from "h3"

import { Chicken } from "../../../../domain/chicken/entities/Chicken"
import { requireAuth } from "../../../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../../../infrastructure/db/repositories/DrizzleChickenRepository"

export default defineEventHandler(async(event) => {
  if (process.env.NODE_ENV === "production") throw createError({ statusCode: 404 })

  const userId = await requireAuth(event)
  const chickenId = Number(getRouterParam(event, "id"))
  const repo = new DrizzleChickenRepository()

  const chicken = await repo.findById(chickenId)
  if (!chicken || chicken.userId !== userId) throw createError({ statusCode: 404 })

  const now = new Date()
  const patched = new Chicken(
    chicken.id, chicken.userId, chicken.name, chicken.level, chicken.xp, chicken.stats,
    chicken.hatchAt, chicken.fedAt, chicken.wateredAt, now, now, now,
  )
  await repo.save(patched)
  return { ok: true }
})
