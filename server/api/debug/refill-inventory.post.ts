import { INVENTORY_ITEM } from "../../domain/economy/entities/InventoryItem"
import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleInventoryRepository } from "../../infrastructure/db/repositories/DrizzleInventoryRepository"

const REFILL_AMOUNT = 20

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const repo = new DrizzleInventoryRepository()

  const [
    water,
    flour,
  ] = await Promise.all([
    repo.add(userId, INVENTORY_ITEM.WATER, REFILL_AMOUNT),
    repo.add(userId, INVENTORY_ITEM.FLOUR, REFILL_AMOUNT),
  ])

  return {
    water,
    flour,
  }
})
