import { CHICKEN_LEVELS, Chicken } from "../../domain/chicken/entities/Chicken"

import type { IChickenRepository } from "../../domain/chicken/repositories/IChickenRepository"

export type HatchEggInput = {
  userId: number
  chickenId: number
}

export type HatchEggResult =
  | { result: "hatched"; chicken: Chicken }
  | { result: "lost" }

export class HatchEggUseCase {
  constructor(private readonly chickens: IChickenRepository) {}

  async execute(input: HatchEggInput, now = new Date()): Promise<HatchEggResult> {
    const chicken = await this.chickens.findById(input.chickenId)
    if (!chicken) throw new Error("Chicken not found")
    if (chicken.userId !== input.userId) throw new Error("Not your chicken")
    if (chicken.level !== CHICKEN_LEVELS.EGG) throw new Error("Not an egg")
    if (!chicken.isHatched(now)) throw new Error("Not ready to hatch yet")

    const careOk = chicken.isHumidityOk(now)
      && chicken.isTemperatureOk(now)
      && chicken.isTurnedOk(now)

    if (!careOk) {
      await this.chickens.delete(chicken.id)
      return { result: "lost" }
    }

    const hatched = new Chicken(
      chicken.id, chicken.userId, chicken.name, CHICKEN_LEVELS.CHICK,
      chicken.xp, chicken.stats, null,
      chicken.humidityAdjustedAt, chicken.temperatureAdjustedAt, chicken.turnedAt,
    )
    return {
      result: "hatched",
      chicken: await this.chickens.save(hatched), 
    }
  }
}
