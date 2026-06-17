import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/infrastructure/db/schema',
  out: './server/infrastructure/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
