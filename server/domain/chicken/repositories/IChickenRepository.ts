import type { Chicken } from "../entities/Chicken"

export type IChickenRepository = {
  findById(id: number): Promise<Chicken | null>
  findByUserId(userId: number): Promise<Chicken[]>
  save(chicken: Chicken): Promise<Chicken>
  delete(id: number): Promise<void>
}
