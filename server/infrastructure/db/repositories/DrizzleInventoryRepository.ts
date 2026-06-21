import { and, eq, gte, sql } from "drizzle-orm"

import { db } from "../index"
import { inventory } from "../schema"

import type { IInventoryRepository } from "../../../domain/economy/repositories/IInventoryRepository"

export class DrizzleInventoryRepository implements IInventoryRepository {
  async getQuantity(userId: number, item: string): Promise<number> {
    const row = await db.query.inventory.findFirst({
      where: and(eq(inventory.userId, userId), eq(inventory.item, item)),
    })
    return row?.quantity ?? 0
  }

  async getAll(userId: number): Promise<Record<string, number>> {
    const rows = await db.select().from(inventory).where(eq(inventory.userId, userId))
    return Object.fromEntries(rows.map(r => [
      r.item,
      r.quantity,
    ]))
  }

  async add(userId: number, item: string, amount: number): Promise<number> {
    const [row] = await db
      .insert(inventory)
      .values({
        userId,
        item,
        quantity: amount, 
      })
      .onConflictDoUpdate({
        target: [
          inventory.userId,
          inventory.item,
        ],
        set: { quantity: sql`${inventory.quantity} + ${amount}` },
      })
      .returning()
    if (!row) throw new Error("Failed to add inventory item")
    return row.quantity
  }

  async spend(userId: number, item: string, amount: number): Promise<number> {
    const [row] = await db
      .update(inventory)
      .set({ quantity: sql`${inventory.quantity} - ${amount}` })
      .where(and(
        eq(inventory.userId, userId),
        eq(inventory.item, item),
        gte(inventory.quantity, amount),
      ))
      .returning()
    if (!row) throw new Error("Not enough resources")
    return row.quantity
  }
}
