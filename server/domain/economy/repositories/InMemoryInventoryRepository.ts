import type { IInventoryRepository } from "./IInventoryRepository"

export class InMemoryInventoryRepository implements IInventoryRepository {
  private readonly store = new Map<string, number>()

  private key(userId: number, item: string): string {
    return `${userId}:${item}`
  }

  async getQuantity(userId: number, item: string): Promise<number> {
    return this.store.get(this.key(userId, item)) ?? 0
  }

  async getAll(userId: number): Promise<Record<string, number>> {
    const result: Record<string, number> = {}
    for (const [
      key,
      quantity,
    ] of this.store.entries()) {
      const prefix = `${userId}:`
      if (key.startsWith(prefix)) {
        result[key.slice(prefix.length)] = quantity
      }
    }
    return result
  }

  async add(userId: number, item: string, amount: number): Promise<number> {
    const current = this.store.get(this.key(userId, item)) ?? 0
    const next = current + amount
    this.store.set(this.key(userId, item), next)
    return next
  }

  async spend(userId: number, item: string, amount: number): Promise<number> {
    const current = this.store.get(this.key(userId, item)) ?? 0
    if (current < amount) throw new Error("Not enough resources")
    const next = current - amount
    this.store.set(this.key(userId, item), next)
    return next
  }
}
