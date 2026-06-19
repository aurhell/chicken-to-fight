import { describe, expect, it, beforeEach } from "vitest"

import { InMemoryChickenRepository } from "../../domain/chicken/repositories/InMemoryChickenRepository"
import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"

import { AdoptEggUseCase } from "./AdoptEggUseCase"
import { CareForEggUseCase } from "./CareForEggUseCase"

const FIXED_NOW = new Date("2026-01-01T12:00:00Z")
const ONE_HOUR_LATER = new Date(FIXED_NOW.getTime() + 3_600_000)

describe("CareForEggUseCase", () => {
  let chickens: InMemoryChickenRepository
  let users: InMemoryUserRepository
  let careUseCase: CareForEggUseCase
  let userId: number
  let eggId: number

  beforeEach(async() => {
    chickens = new InMemoryChickenRepository()
    users = new InMemoryUserRepository()
    careUseCase = new CareForEggUseCase(chickens)

    const user = await users.create({
      username: "Coach",
      email: "a@a.com",
      passwordHash: "x", 
    })
    userId = user.id

    const adoptUseCase = new AdoptEggUseCase(chickens, users)
    const { chicken } = await adoptUseCase.execute({
      userId,
      name: "Bob", 
    }, FIXED_NOW)
    eggId = chicken.id
  })

  describe("Given an egg with stale humidity", () => {
    it("resets humidityAdjustedAt", async() => {
      // When
      const updated = await careUseCase.execute({
        userId,
        chickenId: eggId,
        action: "humidity", 
      }, ONE_HOUR_LATER)

      // Then
      expect(updated.humidityAdjustedAt).toEqual(ONE_HOUR_LATER)
    })
  })

  describe("Given an egg with stale temperature", () => {
    it("resets temperatureAdjustedAt", async() => {
      // When
      const updated = await careUseCase.execute({
        userId,
        chickenId: eggId,
        action: "temperature", 
      }, ONE_HOUR_LATER)

      // Then
      expect(updated.temperatureAdjustedAt).toEqual(ONE_HOUR_LATER)
    })
  })

  describe("Given an egg that needs turning", () => {
    it("resets turnedAt", async() => {
      // When
      const updated = await careUseCase.execute({
        userId,
        chickenId: eggId,
        action: "turn", 
      }, ONE_HOUR_LATER)

      // Then
      expect(updated.turnedAt).toEqual(ONE_HOUR_LATER)
    })
  })

  describe("Given another user's egg", () => {
    it("throws 'Not your chicken'", async() => {
      // Given
      const other = await users.create({
        username: "Other",
        email: "b@b.com",
        passwordHash: "x", 
      })

      // When / Then
      await expect(careUseCase.execute({
        userId: other.id,
        chickenId: eggId,
        action: "turn", 
      }, ONE_HOUR_LATER))
        .rejects.toThrow("Not your chicken")
    })
  })

  describe("Given a non-egg chicken", () => {
    it("throws 'Not an egg'", async() => {
      // Given — hatch the egg by setting hatchAt in the past
      const egg = await chickens.findById(eggId)
      const hatched = new (await import("../../domain/chicken/entities/Chicken")).Chicken(
        egg!.id, egg!.userId, egg!.name, egg!.level, egg!.xp, egg!.stats,
        new Date("2020-01-01"),
        egg!.humidityAdjustedAt, egg!.temperatureAdjustedAt, egg!.turnedAt,
      )
      await chickens.save(hatched)

      // When / Then
      await expect(careUseCase.execute({
        userId,
        chickenId: eggId,
        action: "turn", 
      }, ONE_HOUR_LATER))
        .rejects.toThrow("Not an egg")
    })
  })
})
