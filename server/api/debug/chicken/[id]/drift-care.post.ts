import { getRouterParam } from "h3"

import { CARE_DRIFT_H, Chicken } from "../../../../domain/chicken/entities/Chicken"
import { requireAuth } from "../../../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../../../infrastructure/db/repositories/DrizzleChickenRepository"

const MS_PER_HOUR = 3_600_000
const DRIFT_EXTRA_H = 1

export default defineEventHandler(async(event) => {
  if (process.env.NODE_ENV === "production") throw createError({ statusCode: 404 })

  const userId = await requireAuth(event)
  const chickenId = Number(getRouterParam(event, "id"))
  const repo = new DrizzleChickenRepository()

  const chicken = await repo.findById(chickenId)
  if (!chicken || chicken.userId !== userId) throw createError({ statusCode: 404 })

  const stale = new Date(Date.now() - (CARE_DRIFT_H + DRIFT_EXTRA_H) * MS_PER_HOUR)
  const patched = new Chicken(
    chicken.id, chicken.userId, chicken.name, chicken.level, chicken.xp, chicken.stats,
    chicken.hatchAt, stale, stale, stale,
  )
  await repo.save(patched)
  return { ok: true }
})
