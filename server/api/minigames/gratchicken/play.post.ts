import { PlayScratchCardUseCase } from "../../../application/minigames/PlayScratchCardUseCase"
import { requireAuth } from "../../../infrastructure/auth/session"
import { DrizzleScratchCardRepository } from "../../../infrastructure/db/repositories/DrizzleScratchCardRepository"
import { DrizzleUserRepository } from "../../../infrastructure/db/repositories/DrizzleUserRepository"

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)

  try {
    return await new PlayScratchCardUseCase(
      new DrizzleScratchCardRepository(),
      new DrizzleUserRepository(),
    ).execute(userId)
  } catch(e) {
    throw createError({
      statusCode: 400,
      statusMessage: e instanceof Error ? e.message : "Play failed",
    })
  }
})
