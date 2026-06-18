import { boolean, integer, json, pgTable, serial, timestamp } from "drizzle-orm/pg-core"

import { users } from "./users"

import type { Grid } from "../../../domain/minigames/entities/ScratchCard"

export const scratchCardPlays = pgTable("scratch_card_plays", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  grid: json("grid").$type<Grid>().notNull(),
  won: boolean("won").notNull().default(false),
  playedAt: timestamp("played_at").notNull().defaultNow(),
})
