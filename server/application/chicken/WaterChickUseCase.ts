import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"
import { INVENTORY_ITEM } from "../../domain/economy/entities/InventoryItem"

import type { IChickenRepository } from "../../domain/chicken/repositories/IChickenRepository"
import type { IInventoryRepository } from "../../domain/economy/repositories/IInventoryRepository"

export type WaterChickInput = {
  userId: number
  chickenId: number
}

export type WaterChickResult = {
  wateredAt: Date
  water: number
}

export class WaterChickUseCase {
  constructor(
    private readonly chickens: IChickenRepository,
    private readonly inventory: IInventoryRepository,
  ) {}

  async execute(input: WaterChickInput, now = new Date()): Promise<WaterChickResult> {
    const chicken = await this.chickens.findById(input.chickenId)
    if (!chicken) throw new Error("Chicken not found")
    if (chicken.userId !== input.userId) throw new Error("Not your chicken")
    if (chicken.level !== CHICKEN_LEVELS.CHICK) throw new Error("Not a chick")

    const water = await this.inventory.spend(input.userId, INVENTORY_ITEM.WATER, 1)
    const watered = chicken.water(now)
    await this.chickens.save(watered)

    return {
      wateredAt: now,
      water, 
    }
  }
}
