import { SellChickenUseCase } from "../../../application/chicken/SellChickenUseCase"
import { requireAuth } from "../../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../../infrastructure/db/repositories/DrizzleChickenRepository"
import { DrizzleUserRepository } from "../../../infrastructure/db/repositories/DrizzleUserRepository"

const DOMAIN_ERRORS: Record<string, number> = {
  "Chicken not found": 404,
  "Not your chicken": 403,
}

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenId = Number(getRouterParam(event, "id"))

  const useCase = new SellChickenUseCase(
    new DrizzleChickenRepository(),
    new DrizzleUserRepository(),
  )

  try {
    const result = await useCase.execute({
      userId,
      chickenId, 
    })
    return result
  } catch(e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    const statusCode = DOMAIN_ERRORS[message] ?? 500
    throw createError({
      statusCode,
      message, 
    })
  }
})
