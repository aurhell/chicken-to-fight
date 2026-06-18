import { DAILY_FREE_PLAYS } from "../../../domain/minigames/entities/ScratchCard"
import { requireAuth } from "../../../infrastructure/auth/session"
import { DrizzleScratchCardRepository } from "../../../infrastructure/db/repositories/DrizzleScratchCardRepository"

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const todayPlays = await new DrizzleScratchCardRepository().countTodayPlays(userId)

  return {
    playsRemaining: Math.max(0, DAILY_FREE_PLAYS - todayPlays),
    totalPlays: DAILY_FREE_PLAYS,
  }
})
