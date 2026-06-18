import {
  DAILY_FREE_PLAYS,
  WIN_REWARD_PO,
  generateGrid,
  isWinningGrid, type Grid, 
} from "../../domain/minigames/entities/ScratchCard"

import type { IScratchCardRepository } from "../../domain/minigames/repositories/IScratchCardRepository"
import type { IUserRepository } from "../../domain/user/repositories/IUserRepository"

export type PlayResult = {
  grid: Grid
  won: boolean
  reward: number
  playsRemaining: number
}

export class PlayScratchCardUseCase {
  constructor(
    private readonly scratchCards: IScratchCardRepository,
    private readonly users: IUserRepository,
  ) {}

  async execute(userId: number): Promise<PlayResult> {
    const todayPlays = await this.scratchCards.countTodayPlays(userId)

    if (todayPlays >= DAILY_FREE_PLAYS)
      throw new Error("No plays remaining today")

    const grid = generateGrid()
    const won = isWinningGrid(grid)

    await this.scratchCards.save({
      userId,
      grid,
      won, 
    })

    if (won)
      await this.users.addGold(userId, WIN_REWARD_PO)

    return {
      grid,
      won,
      reward: won ? WIN_REWARD_PO : 0,
      playsRemaining: DAILY_FREE_PLAYS - todayPlays - 1,
    }
  }
}
