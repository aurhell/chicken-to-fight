import { beforeEach, describe, expect, it, vi } from "vitest"

import * as ScratchCardModule from "../../domain/minigames/entities/ScratchCard"
import { InMemoryScratchCardRepository } from "../../domain/minigames/repositories/InMemoryScratchCardRepository"
import { CellContent } from "../../domain/minigames/value-objects/CellContent"
import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"
import { RegisterUseCase } from "../auth/RegisterUseCase"

import { PlayScratchCardUseCase } from "./PlayScratchCardUseCase"

vi.mock("@node-rs/argon2", () => ({
  hash: vi.fn(async(pwd: string) => `hashed:${pwd}`),
  verify: vi.fn(async(hash: string, pwd: string) => hash === `hashed:${pwd}`),
}))

const LOSING_GRID: CellContent[] = [
  CellContent.CHICKEN,
  CellContent.EGG,
  CellContent.CHICKEN,
  CellContent.CORN,
  CellContent.FEATHER,
  CellContent.CORN,
  CellContent.CHICKEN,
  CellContent.EGG,
  CellContent.CHICKEN,
]

const WINNING_GRID: CellContent[] = [
  CellContent.CHICKEN,
  CellContent.CHICKEN,
  CellContent.CHICKEN,
  CellContent.EGG,
  CellContent.EGG,
  CellContent.EGG,
  CellContent.CORN,
  CellContent.CORN,
  CellContent.FEATHER,
]

describe("PlayScratchCardUseCase", () => {
  let scratchCards: InMemoryScratchCardRepository
  let users: InMemoryUserRepository
  let useCase: PlayScratchCardUseCase
  let userId: number

  beforeEach(async() => {
    scratchCards = new InMemoryScratchCardRepository()
    users = new InMemoryUserRepository()
    useCase = new PlayScratchCardUseCase(scratchCards, users)
    const user = await new RegisterUseCase(users).execute("alice", "alice@example.com", "password123")
    userId = user.id
  })

  describe("given a user with plays remaining", () => {
    describe("when playing with a losing grid", () => {
      it("then returns won=false, reward=0, and decrements plays remaining", async() => {
        vi.spyOn(ScratchCardModule, "generateGrid").mockReturnValueOnce(LOSING_GRID)
        const result = await useCase.execute(userId)
        expect(result.won).toBe(false)
        expect(result.reward).toBe(0)
        expect(result.grid).toHaveLength(9)
        expect(result.playsRemaining).toBe(1)
      })
    })

    describe("when playing with a winning grid", () => {
      it("then returns won=true and reward 50 PO", async() => {
        vi.spyOn(ScratchCardModule, "generateGrid").mockReturnValueOnce(WINNING_GRID)
        const result = await useCase.execute(userId)
        expect(result.won).toBe(true)
        expect(result.reward).toBe(50)
      })

      it("then adds 50 PO to the user's gold", async() => {
        vi.spyOn(ScratchCardModule, "generateGrid").mockReturnValueOnce(WINNING_GRID)
        const goldBefore = (await users.findById(userId))!.gold
        await useCase.execute(userId)
        const goldAfter = (await users.findById(userId))!.gold
        expect(goldAfter - goldBefore).toBe(50)
      })
    })

    describe("when playing twice", () => {
      it("then playsRemaining decreases each time", async() => {
        vi.spyOn(ScratchCardModule, "generateGrid")
          .mockReturnValueOnce(LOSING_GRID)
          .mockReturnValueOnce(LOSING_GRID)
        const first = await useCase.execute(userId)
        expect(first.playsRemaining).toBe(1)
        const second = await useCase.execute(userId)
        expect(second.playsRemaining).toBe(0)
      })
    })
  })

  describe("given a user with no plays remaining", () => {
    describe("when trying to play a third time", () => {
      it("then throws 'No plays remaining today'", async() => {
        vi.spyOn(ScratchCardModule, "generateGrid").mockReturnValue(LOSING_GRID)
        await useCase.execute(userId)
        await useCase.execute(userId)
        await expect(useCase.execute(userId)).rejects.toThrow("No plays remaining today")
      })
    })
  })

  describe("given a completed play", () => {
    describe("when checking the play count", () => {
      it("then the count increments by 1", async() => {
        vi.spyOn(ScratchCardModule, "generateGrid").mockReturnValueOnce(LOSING_GRID)
        expect(await scratchCards.countTodayPlays(userId)).toBe(0)
        await useCase.execute(userId)
        expect(await scratchCards.countTodayPlays(userId)).toBe(1)
      })
    })
  })
})
