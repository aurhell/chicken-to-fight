import type { CareAction, Chicken } from "../../domain/chicken/entities/Chicken"
import type { IChickenRepository } from "../../domain/chicken/repositories/IChickenRepository"

export type CareForEggInput = {
  userId: number
  chickenId: number
  action: CareAction
}

export class CareForEggUseCase {
  constructor(private readonly chickens: IChickenRepository) {}

  async execute(input: CareForEggInput, now = new Date()): Promise<Chicken> {
    const chicken = await this.chickens.findById(input.chickenId)
    if (!chicken) throw new Error("Chicken not found")
    if (chicken.userId !== input.userId) throw new Error("Not your chicken")
    if (!chicken.isEgg(now)) throw new Error("Not an egg")

    return this.chickens.save(chicken.care(input.action, now))
  }
}
