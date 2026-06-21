import { readBody } from "h3"

import { BuyShopItemUseCase } from "../../application/economy/BuyShopItemUseCase"
import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleInventoryRepository } from "../../infrastructure/db/repositories/DrizzleInventoryRepository"
import { DrizzleUserRepository } from "../../infrastructure/db/repositories/DrizzleUserRepository"

const DOMAIN_ERRORS: Record<string, number> = {
  "Unknown shop item": 400,
  "Insufficient gold": 422,
}

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const { itemId } = await readBody<{ itemId: string }>(event)

  const useCase = new BuyShopItemUseCase(
    new DrizzleUserRepository(),
    new DrizzleInventoryRepository(),
  )

  try {
    return await useCase.execute({
      userId,
      itemId, 
    })
  } catch(e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    const statusCode = DOMAIN_ERRORS[message] ?? 500
    throw createError({
      statusCode,
      message, 
    })
  }
})
