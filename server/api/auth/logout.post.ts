import { getSession } from "../../infrastructure/auth/session"

export default defineEventHandler(async(event) => {
  const session = await getSession(event)
  await session.clear()
  return { ok: true }
})
