import { RegisterUseCase } from "../../application/auth/RegisterUseCase"
import { getSession } from "../../infrastructure/auth/session"
import { DrizzleUserRepository } from "../../infrastructure/db/repositories/DrizzleUserRepository"

export default defineEventHandler(async(event) => {
  const body = await readBody<{ username?: string; email?: string; password?: string }>(event)

  if (!body.username || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    })
  }

  try {
    const user = await new RegisterUseCase(new DrizzleUserRepository()).execute(
      body.username,
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
  } catch(e) {
    throw createError({
      statusCode: 400,
      statusMessage: e instanceof Error ? e.message : "Registration failed",
    })
  }
})
