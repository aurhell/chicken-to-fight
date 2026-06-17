import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleUserRepository } from "../../infrastructure/db/repositories/DrizzleUserRepository"

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const user = await new DrizzleUserRepository().findById(userId)
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    })
  }
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      gold: user.gold,
    },
  }
})
