import { readBody } from "h3"

import { AdoptEggUseCase } from "../../application/chicken/AdoptEggUseCase"
import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../infrastructure/db/repositories/DrizzleChickenRepository"
import { DrizzleUserRepository } from "../../infrastructure/db/repositories/DrizzleUserRepository"

const HTTP_SERVER_ERROR = 500

const DOMAIN_ERRORS: Record<string, number> = {
  "Not enough gold": 422,
  "Already incubating an egg": 409,
}

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const { name } = await readBody<{ name: string }>(event)

  let chicken, gold
  try {
    ;({ chicken, gold } = await new AdoptEggUseCase(
      new DrizzleChickenRepository(),
      new DrizzleUserRepository(),
    ).execute({
      userId,
      name, 
    }))
  } catch(e) {
    const msg = e instanceof Error ? e.message : "Adoption failed"
    throw createError({
      statusCode: DOMAIN_ERRORS[msg] ?? HTTP_SERVER_ERROR,
      message: msg, 
    })
  }

  return {
    chicken: {
      id: chicken.id,
      name: chicken.name,
      hatchAt: chicken.hatchAt,
      humidityOk: chicken.isHumidityOk(),
      temperatureOk: chicken.isTemperatureOk(),
      turnedOk: chicken.isTurnedOk(),
    },
    gold,
  }
})
