import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"

import { users } from "./users"

const DEFAULT_HUNGER = 100
const DEFAULT_THIRST = 100
const DEFAULT_HAPPINESS = 100

export const chickens = pgTable("chickens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  hunger: integer("hunger").notNull().default(DEFAULT_HUNGER),
  thirst: integer("thirst").notNull().default(DEFAULT_THIRST),
  happiness: integer("happiness").notNull().default(DEFAULT_HAPPINESS),
  fatigue: integer("fatigue").notNull().default(0),
  hatchAt: timestamp("hatch_at"),
  fedAt: timestamp("fed_at"),
  wateredAt: timestamp("watered_at"),
  humidityAdjustedAt: timestamp("humidity_adjusted_at").notNull().defaultNow(),
  temperatureAdjustedAt: timestamp("temperature_adjusted_at").notNull().defaultNow(),
  turnedAt: timestamp("turned_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
