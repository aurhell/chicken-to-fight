import { describe, expect, it, beforeEach } from "vitest"

import { INCUBATION_DURATION_H } from "../../domain/chicken/entities/Chicken"
import { InMemoryChickenRepository } from "../../domain/chicken/repositories/InMemoryChickenRepository"
import { INVENTORY_ITEM } from "../../domain/economy/entities/InventoryItem"
import { InMemoryInventoryRepository } from "../../domain/economy/repositories/InMemoryInventoryRepository"
import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"

import { AdoptEggUseCase } from "./AdoptEggUseCase"
import { FeedChickUseCase } from "./FeedChickUseCase"
import { HatchEggUseCase } from "./HatchEggUseCase"

const MS_PER_HOUR = 3_600_000
const ADOPTION_TIME = new Date("2026-01-01T12:00:00Z")
const HATCH_TIME = new Date(ADOPTION_TIME.getTime() + INCUBATION_DURATION_H * MS_PER_HOUR + 1_000)
const CARE_REFRESH_TIME = new Date(HATCH_TIME.getTime() - MS_PER_HOUR)
const STARTING_FLOUR = 10

describe("FeedChickUseCase", () => {
  let chickens: InMemoryChickenRepository
  let inventory: InMemoryInventoryRepository
  let useCase: FeedChickUseCase
  let userId: number
  let chickId: number

  beforeEach(async() => {
    chickens = new InMemoryChickenRepository()
    inventory = new InMemoryInventoryRepository()
    const users = new InMemoryUserRepository()
    useCase = new FeedChickUseCase(chickens, inventory)

    const user = await users.create({
      username: "Coach",
      email: "a@a.com",
      passwordHash: "x", 
    })
    userId = user.id
    await inventory.add(userId, INVENTORY_ITEM.FLOUR, STARTING_FLOUR)

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
    if (result.result !== "hatched") throw new Error("Setup failed")
    chickId = result.chicken.id
  })

  describe("Given a chick owned by the user with sufficient flour", () => {
    it("resets fedAt to now and spends 1 flour", async() => {
      // Given
      const now = new Date(HATCH_TIME.getTime() + MS_PER_HOUR)

      // When
      const result = await useCase.execute({
        userId,
        chickenId: chickId, 
      }, now)

      // Then
      expect(result.fedAt).toEqual(now)
      expect(result.flour).toBe(STARTING_FLOUR - 1)

      const chickAfter = await chickens.findById(chickId)
      if (!chickAfter) throw new Error("Chick not found after feed")
      expect(chickAfter.fedAt).toEqual(now)
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

  describe("Given a non-existent chicken", () => {
    it("throws 'Chicken not found'", async() => {
      await expect(useCase.execute({
        userId,
        chickenId: 999, 
      }))
        .rejects.toThrow("Chicken not found")
    })
  })

  describe("Given an egg (not yet hatched)", () => {
    it("throws 'Not a chick'", async() => {
      const localUsers = new InMemoryUserRepository()
      const user2 = await localUsers.create({
        username: "Coach2",
        email: "b@b.com",
        passwordHash: "x", 
      })
      const { chicken: egg } = await new AdoptEggUseCase(chickens, localUsers).execute({
        userId: user2.id,
        name: "Oeuf2", 
      }, HATCH_TIME)
      await expect(useCase.execute({
        userId: user2.id,
        chickenId: egg.id, 
      }))
        .rejects.toThrow("Not a chick")
    })
  })

  describe("Given a user with no flour", () => {
    it("throws 'Not enough resources'", async() => {
      await inventory.spend(userId, INVENTORY_ITEM.FLOUR, STARTING_FLOUR)
      await expect(useCase.execute({
        userId,
        chickenId: chickId, 
      }))
        .rejects.toThrow("Not enough resources")
    })
  })
})
