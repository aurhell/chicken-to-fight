import { describe, expect, it, beforeEach } from "vitest"

import { CHICKEN_LEVELS, CHICKEN_SELL_PRICE, INCUBATION_DURATION_H } from "../../domain/chicken/entities/Chicken"
import { InMemoryChickenRepository } from "../../domain/chicken/repositories/InMemoryChickenRepository"
import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"

import { AdoptEggUseCase } from "./AdoptEggUseCase"
import { HatchEggUseCase } from "./HatchEggUseCase"
import { SellChickenUseCase } from "./SellChickenUseCase"

const MS_PER_HOUR = 3_600_000
const ADOPTION_TIME = new Date("2026-01-01T12:00:00Z")
const HATCH_TIME = new Date(ADOPTION_TIME.getTime() + INCUBATION_DURATION_H * MS_PER_HOUR + 1_000)
const CARE_REFRESH_TIME = new Date(HATCH_TIME.getTime() - MS_PER_HOUR)

describe("SellChickenUseCase", () => {
  let chickens: InMemoryChickenRepository
  let users: InMemoryUserRepository
  let useCase: SellChickenUseCase
  let userId: number
  let chickId: number

  beforeEach(async() => {
    chickens = new InMemoryChickenRepository()
    users = new InMemoryUserRepository()
    useCase = new SellChickenUseCase(chickens, users)

    const user = await users.create({
      username: "Coach",
      email: "a@a.com",
      passwordHash: "x", 
    })
    userId = user.id

    const { chicken: egg } = await new AdoptEggUseCase(chickens, users).execute({
      userId,
      name: "Poussin", 
    }, ADOPTION_TIME)

    const stored = await chickens.findById(egg.id)
    if (!stored) throw new Error("Test setup: egg not found")
    await chickens.save(
      stored
        .care("humidity", CARE_REFRESH_TIME)
        .care("temperature", CARE_REFRESH_TIME)
        .care("turn", CARE_REFRESH_TIME),
    )

    const result = await new HatchEggUseCase(chickens).execute({
      userId,
      chickenId: egg.id, 
    }, HATCH_TIME)
    if (result.result !== "hatched") throw new Error("Setup failed: egg was lost")
    chickId = result.chicken.id
  })

  describe("Given a hatched chick owned by the user", () => {
    it("deletes the chick and returns the updated gold", async() => {
      // Given
      const userBefore = await users.findById(userId)
      if (!userBefore) throw new Error("Test setup: user not found")
      const goldBefore = userBefore.gold

      // When
      const result = await useCase.execute({
        userId,
        chickenId: chickId, 
      })

      // Then
      expect(result.gold).toBe(goldBefore + CHICKEN_SELL_PRICE)
      expect(await chickens.findById(chickId)).toBeNull()
    })
  })

  describe("Given a chicken that does not exist", () => {
    it("throws 'Chicken not found'", async() => {
      await expect(useCase.execute({
        userId,
        chickenId: 999, 
      }))
        .rejects.toThrow("Chicken not found")
    })
  })

  describe("Given another user's chick", () => {
    it("throws 'Not your chicken'", async() => {
      await expect(useCase.execute({
        userId: 999,
        chickenId: chickId, 
      }))
        .rejects.toThrow("Not your chicken")
    })
  })

  describe("Given an egg (not yet hatched)", () => {
    it("throws 'Not a chick'", async() => {
      const { chicken: egg } = await new AdoptEggUseCase(chickens, users).execute(
        {
          userId,
          name: "Oeuf2", 
        },
        HATCH_TIME,
      )
      await expect(useCase.execute({
        userId,
        chickenId: egg.id, 
      }))
        .rejects.toThrow("Not a chick")
    })
  })
})
