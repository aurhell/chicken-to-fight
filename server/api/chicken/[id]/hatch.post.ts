import { getRouterParam } from "h3"

import { HatchEggUseCase } from "../../../application/chicken/HatchEggUseCase"
import { requireAuth } from "../../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../../infrastructure/db/repositories/DrizzleChickenRepository"

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenId = Number(getRouterParam(event, "id"))

  const now = new Date()
  const result = await new HatchEggUseCase(new DrizzleChickenRepository())
    .execute({
      userId,
      chickenId, 
    }, now)

  if (result.result === "lost") return { result: "lost" }

  const { chicken } = result
  return {
    result: "hatched",
    chicken: {
      id: chicken.id,
      name: chicken.name,
      level: chicken.level,
    },
  }
})
