import { describe, expect, it, beforeEach } from "vitest"

import { CHICKEN_LEVELS, EGG_ADOPTION_COST, INCUBATION_DURATION_H } from "../../domain/chicken/entities/Chicken"
import { InMemoryChickenRepository } from "../../domain/chicken/repositories/InMemoryChickenRepository"
import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"

import { AdoptEggUseCase } from "./AdoptEggUseCase"

const MS_PER_HOUR = 3_600_000
const FIXED_NOW = new Date("2026-01-01T12:00:00Z")

describe("AdoptEggUseCase", () => {
  let chickens: InMemoryChickenRepository
  let users: InMemoryUserRepository
  let useCase: AdoptEggUseCase

  beforeEach(() => {
    chickens = new InMemoryChickenRepository()
    users = new InMemoryUserRepository()
    useCase = new AdoptEggUseCase(chickens, users)
  })

  describe("Given a user with enough gold and no egg", () => {
    it("creates an egg and deducts the adoption cost", async() => {
      // Given
      const user = await users.create({
        username: "Coach",
        email: "a@a.com",
        passwordHash: "x", 
      })

      // When
      const result = await useCase.execute({
        userId: user.id,
        name: "Œuf de la victoire", 
      }, FIXED_NOW)

      // Then
      const updatedUser = await users.findById(user.id)
      expect(updatedUser!.gold).toBe(user.gold - EGG_ADOPTION_COST)
      expect(result.chicken.level).toBe(CHICKEN_LEVELS.EGG)
      expect(result.chicken.hatchAt).toEqual(new Date(FIXED_NOW.getTime() + INCUBATION_DURATION_H * MS_PER_HOUR))
    })

    it("sets all care timestamps to adoption time", async() => {
      // Given
      const user = await users.create({
        username: "Coach",
        email: "a@a.com",
        passwordHash: "x", 
      })

      // When
      const result = await useCase.execute({
        userId: user.id,
        name: "Bob", 
      }, FIXED_NOW)

      // Then
      expect(result.chicken.humidityAdjustedAt).toEqual(FIXED_NOW)
      expect(result.chicken.temperatureAdjustedAt).toEqual(FIXED_NOW)
      expect(result.chicken.turnedAt).toEqual(FIXED_NOW)
    })
  })

  describe("Given a user with not enough gold", () => {
    it("throws 'Not enough gold'", async() => {
      // Given
      const user = await users.create({
        username: "Poor",
        email: "p@p.com",
        passwordHash: "x", 
      })
      await users.addGold(user.id, -(user.gold - EGG_ADOPTION_COST + 1))

      // When / Then
      await expect(useCase.execute({
        userId: user.id,
        name: "Bob", 
      }, FIXED_NOW))
        .rejects.toThrow("Not enough gold")
    })
  })

  describe("Given a user who already has an egg incubating", () => {
    it("throws 'Already incubating an egg'", async() => {
      // Given
      const user = await users.create({
        username: "Coach",
        email: "a@a.com",
        passwordHash: "x", 
      })
      await useCase.execute({
        userId: user.id,
        name: "Premier oeuf", 
      }, FIXED_NOW)

      // When / Then
      await expect(useCase.execute({
        userId: user.id,
        name: "Deuxième oeuf", 
      }, FIXED_NOW))
        .rejects.toThrow("Already incubating an egg")
    })
  })
})
