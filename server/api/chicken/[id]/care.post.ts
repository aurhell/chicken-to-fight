import { readBody, getRouterParam } from "h3"

import { CareForEggUseCase } from "../../../application/chicken/CareForEggUseCase"
import { requireAuth } from "../../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../../infrastructure/db/repositories/DrizzleChickenRepository"

import type { CareAction } from "../../../domain/chicken/entities/Chicken"

const VALID_ACTIONS: CareAction[] = [
  "humidity",
  "temperature",
  "turn",
]

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenId = Number(getRouterParam(event, "id"))
  const { action } = await readBody<{ action: CareAction }>(event)

  if (!VALID_ACTIONS.includes(action)) throw createError({
    statusCode: 400,
    message: "Invalid action", 
  })

  const now = new Date()
  const chicken = await new CareForEggUseCase(new DrizzleChickenRepository())
    .execute({
      userId,
      chickenId,
      action, 
    }, now)

  return {
    humidityOk: chicken.isHumidityOk(now),
    temperatureOk: chicken.isTemperatureOk(now),
    turnedOk: chicken.isTurnedOk(now),
  }
})
