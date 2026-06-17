import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

const DEFAULT_GOLD = 120

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  gold: integer("gold").notNull().default(DEFAULT_GOLD),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
