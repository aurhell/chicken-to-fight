import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"

import { chickens } from "./chickens"

export const chickenStages = pgTable("chicken_stages", {
  chickenId: integer("chicken_id").notNull().references(() => chickens.id, { onDelete: "cascade" }),
  stageId: text("stage_id").notNull(),
  startedAt: timestamp("started_at").notNull(),
}, t => ({
  pk: primaryKey({
    columns: [
      t.chickenId,
      t.stageId,
    ], 
  }),
}))
