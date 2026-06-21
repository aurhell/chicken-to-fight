import { integer, pgTable, serial, text, unique } from "drizzle-orm/pg-core"

import { users } from "./users"

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  item: text("item").notNull(),
  quantity: integer("quantity").notNull().default(0),
}, t => ({
  userItemUnique: unique().on(t.userId, t.item),
}))
