import { GraduateAdolescentUseCase } from "../../../application/chicken/GraduateAdolescentUseCase"
import { requireAuth } from "../../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../../infrastructure/db/repositories/DrizzleChickenRepository"
import { DrizzleStageRepository } from "../../../infrastructure/db/repositories/DrizzleStageRepository"

const HTTP_SERVER_ERROR = 500

const DOMAIN_ERRORS: Record<string, number> = {
  "Chicken not found": 404,
  "Not your chicken": 403,
  "Not an adolescent": 422,
  "Not enough stages completed": 422,
}

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenId = Number(getRouterParam(event, "id"))

  const useCase = new GraduateAdolescentUseCase(
    new DrizzleChickenRepository(),
    new DrizzleStageRepository(),
  )

  try {
    return await useCase.execute({
      userId,
      chickenId, 
    })
  } catch(e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    const statusCode = DOMAIN_ERRORS[message] ?? HTTP_SERVER_ERROR
    throw createError({
      statusCode,
      message, 
    })
  }
})
