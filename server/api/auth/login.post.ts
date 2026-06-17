import { LoginUseCase } from "../../application/auth/LoginUseCase"
import { getSession } from "../../infrastructure/auth/session"
import { DrizzleUserRepository } from "../../infrastructure/db/repositories/DrizzleUserRepository"

export default defineEventHandler(async(event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    })
  }

  try {
    const user = await new LoginUseCase(new DrizzleUserRepository()).execute(
      body.email,
      body.password,
    )
    const session = await getSession(event)
    await session.update({
      userId: user.id,
    })
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        gold: user.gold,
      },
    }
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    })
  }
})
