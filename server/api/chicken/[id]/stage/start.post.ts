import { readBody } from "h3"

import { StartStageUseCase } from "../../../../application/chicken/StartStageUseCase"
import { requireAuth } from "../../../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../../../infrastructure/db/repositories/DrizzleChickenRepository"
import { DrizzleStageRepository } from "../../../../infrastructure/db/repositories/DrizzleStageRepository"

const HTTP_SERVER_ERROR = 500

const DOMAIN_ERRORS: Record<string, number> = {
  "Chicken not found": 404,
  "Not your chicken": 403,
  "Not an adolescent": 422,
  "Stage already completed": 422,
  "A stage is already in progress": 422,
  "Unknown stage": 400,
}

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenId = Number(getRouterParam(event, "id"))
  const { stageId } = await readBody<{ stageId: string }>(event)

  const useCase = new StartStageUseCase(
    new DrizzleChickenRepository(),
    new DrizzleStageRepository(),
  )

  try {
    const result = await useCase.execute({
      userId,
      chickenId,
      stageId, 
    })
    return {
      stageId: result.stageId,
      startedAt: result.startedAt.toISOString(),
      completesAt: result.completesAt.toISOString(),
    }
  } catch(e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    const statusCode = DOMAIN_ERRORS[message] ?? HTTP_SERVER_ERROR
    throw createError({
      statusCode,
      message, 
    })
  }
})
