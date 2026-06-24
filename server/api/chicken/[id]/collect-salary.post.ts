import { createError } from "h3"

import { CollectSalaryUseCase } from "../../../application/chicken/CollectSalaryUseCase"
import { requireAuth } from "../../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../../infrastructure/db/repositories/DrizzleChickenRepository"
import { DrizzleUserRepository } from "../../../infrastructure/db/repositories/DrizzleUserRepository"

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenId = Number(event.context.params?.id)

  const useCase = new CollectSalaryUseCase(
    new DrizzleChickenRepository(),
    new DrizzleUserRepository(),
  )

  try {
    return await useCase.execute({
      userId,
      chickenId, 
    })
  } catch(e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    throw createError({
      statusCode: 400,
      message, 
    })
  }
})
