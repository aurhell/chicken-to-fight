import { readBody, createError } from "h3"

import { ChooseJobUseCase } from "../../../application/chicken/ChooseJobUseCase"
import { requireAuth } from "../../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../../infrastructure/db/repositories/DrizzleChickenRepository"
import { DrizzleUserRepository } from "../../../infrastructure/db/repositories/DrizzleUserRepository"

import type { JobId } from "#shared/chicken/Job"

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenId = Number(event.context.params?.id)
  const body = await readBody(event)
  const jobId = body?.jobId as JobId | undefined

  if (!jobId) throw createError({
    statusCode: 400,
    message: "jobId is required", 
  })

  const useCase = new ChooseJobUseCase(
    new DrizzleChickenRepository(),
    new DrizzleUserRepository(),
  )

  try {
    return await useCase.execute({
      userId,
      chickenId,
      jobId, 
    })
  } catch(e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    throw createError({
      statusCode: 400,
      message, 
    })
  }
})
