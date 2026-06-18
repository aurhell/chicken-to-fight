import type { Grid } from "../entities/ScratchCard"

export type IScratchCardRepository = {
  countTodayPlays(userId: number): Promise<number>
  save(data: { userId: number; grid: Grid; won: boolean }): Promise<void>
}
