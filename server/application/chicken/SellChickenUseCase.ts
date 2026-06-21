import { CHICKEN_LEVELS, CHICKEN_SELL_PRICES } from "../../domain/chicken/entities/Chicken"

import type { IChickenRepository } from "../../domain/chicken/repositories/IChickenRepository"
import type { IUserRepository } from "../../domain/user/repositories/IUserRepository"

export type SellChickenInput = {
  userId: number
  chickenId: number
}

export type SellChickenResult = {
  gold: number
}

export class SellChickenUseCase {
  constructor(
    private readonly chickens: IChickenRepository,
    private readonly users: IUserRepository,
  ) {}

  async execute(input: SellChickenInput): Promise<SellChickenResult> {
    const chicken = await this.chickens.findById(input.chickenId)
    if (!chicken) throw new Error("Chicken not found")
    if (chicken.userId !== input.userId) throw new Error("Not your chicken")
    const price = CHICKEN_SELL_PRICES[chicken.level] ?? 0
    await this.chickens.delete(chicken.id)
    const updatedUser = await this.users.addGold(input.userId, price)

    return { gold: updatedUser.gold }
  }
}
