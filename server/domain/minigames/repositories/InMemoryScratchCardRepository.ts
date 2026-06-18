import type { IScratchCardRepository } from "./IScratchCardRepository"
import type { Grid } from "../entities/ScratchCard"

type Play = {
  userId: number
  grid: Grid
  won: boolean
  playedAt: Date
}

export class InMemoryScratchCardRepository implements IScratchCardRepository {
  private readonly plays: Play[] = []

  async countTodayPlays(userId: number): Promise<number> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return this.plays.filter(p => p.userId === userId && p.playedAt >= today).length
  }

  async save(data: { userId: number; grid: Grid; won: boolean }): Promise<void> {
    this.plays.push({
      ...data,
      playedAt: new Date(), 
    })
  }
}
