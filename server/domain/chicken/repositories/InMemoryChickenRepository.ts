import { Chicken } from "../entities/Chicken"

import type { CreateChickenData, IChickenRepository } from "./IChickenRepository"

export class InMemoryChickenRepository implements IChickenRepository {
  private store = new Map<number, Chicken>()
  private nextId = 1

  async findById(id: number): Promise<Chicken | null> {
    return this.store.get(id) ?? null
  }

  async findByUserId(userId: number): Promise<Chicken[]> {
    return [...this.store.values()].filter(c => c.userId === userId)
  }

  async create(data: CreateChickenData): Promise<Chicken> {
    const id = this.nextId++
    const chicken = new Chicken(
      id, data.userId, data.name, data.level,
      data.xp, data.stats, data.hatchAt,
      data.fedAt, data.wateredAt,
      data.humidityAdjustedAt, data.temperatureAdjustedAt, data.turnedAt,
    )
    this.store.set(id, chicken)
    return chicken
  }

  async save(chicken: Chicken): Promise<Chicken> {
    this.store.set(chicken.id, chicken)
    return chicken
  }

  async delete(id: number): Promise<void> {
    this.store.delete(id)
  }
}
