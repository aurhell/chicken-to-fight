import type { H3Event } from "h3"

type SessionData = { userId?: number }

const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const SESSION_DURATION_DAYS = 7

const SESSION_MAX_AGE = SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * SESSION_DURATION_DAYS

function getSecret(event: H3Event): string {
  const secret = useRuntimeConfig(event).sessionSecret
  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing SESSION_SECRET",
    })
  }
  return secret as string
}

export async function getSession(event: H3Event) {
  return useSession<SessionData>(event, {
    password: getSecret(event),
    maxAge: SESSION_MAX_AGE,
    name: "ctf_session",
  })
}

export async function requireAuth(event: H3Event): Promise<number> {
  const session = await getSession(event)
  if (!session.data.userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }
  return session.data.userId
}
