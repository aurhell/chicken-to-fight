import { readBody } from "h3"

import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleUserRepository } from "../../infrastructure/db/repositories/DrizzleUserRepository"

export default defineEventHandler(async(event) => {
  if (process.env.NODE_ENV === "production") throw createError({ statusCode: 404 })

  const userId = await requireAuth(event)
  const { amount } = await readBody<{ amount: number }>(event)
  const users = new DrizzleUserRepository()
  const user = await users.addGold(userId, amount)
  return { gold: user.gold }
})
