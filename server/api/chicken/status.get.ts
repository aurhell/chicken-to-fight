import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../infrastructure/db/repositories/DrizzleChickenRepository"

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const repo = new DrizzleChickenRepository()

  const chickens = await repo.findByUserId(userId)
  const now = new Date()
  const egg = chickens.find(c => c.isEgg(now)) ?? null

  if (!egg) return { egg: null }

  return {
    egg: {
      id: egg.id,
      name: egg.name,
      hatchAt: egg.hatchAt,
      humidityOk: egg.isHumidityOk(now),
      temperatureOk: egg.isTemperatureOk(now),
      turnedOk: egg.isTurnedOk(now),
    },
  }
})
