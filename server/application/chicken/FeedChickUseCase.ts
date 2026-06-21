import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"
import { INVENTORY_ITEM } from "../../domain/economy/entities/InventoryItem"

import type { IChickenRepository } from "../../domain/chicken/repositories/IChickenRepository"
import type { IInventoryRepository } from "../../domain/economy/repositories/IInventoryRepository"

export type FeedChickInput = {
  userId: number
  chickenId: number
}

export type FeedChickResult = {
  fedAt: Date
  flour: number
}

export class FeedChickUseCase {
  constructor(
    private readonly chickens: IChickenRepository,
    private readonly inventory: IInventoryRepository,
  ) {}

  async execute(input: FeedChickInput, now = new Date()): Promise<FeedChickResult> {
    const chicken = await this.chickens.findById(input.chickenId)
    if (!chicken) throw new Error("Chicken not found")
    if (chicken.userId !== input.userId) throw new Error("Not your chicken")
    if (chicken.level !== CHICKEN_LEVELS.CHICK) throw new Error("Not a chick")

    const flour = await this.inventory.spend(input.userId, INVENTORY_ITEM.FLOUR, 1)
    const fed = chicken.feed(now)
    await this.chickens.save(fed)

    return {
      fedAt: now,
      flour, 
    }
  }
}
