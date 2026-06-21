import { CHICKEN_LEVELS, CHICKEN_SELL_PRICE } from "../../domain/chicken/entities/Chicken"

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
    if (chicken.level !== CHICKEN_LEVELS.CHICK) throw new Error("Not a chick")

    await this.chickens.delete(chicken.id)
    const updatedUser = await this.users.addGold(input.userId, CHICKEN_SELL_PRICE)

    return { gold: updatedUser.gold }
  }
}
