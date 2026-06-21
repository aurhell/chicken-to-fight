import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleInventoryRepository } from "../../infrastructure/db/repositories/DrizzleInventoryRepository"

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const repo = new DrizzleInventoryRepository()
  const items = await repo.getAll(userId)
  return { items }
})
