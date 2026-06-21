import { describe, expect, it, beforeEach } from "vitest"

import { CHICKEN_LEVELS, INCUBATION_DURATION_H } from "../../domain/chicken/entities/Chicken"
import { InMemoryChickenRepository } from "../../domain/chicken/repositories/InMemoryChickenRepository"
import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"

import { AdoptEggUseCase } from "./AdoptEggUseCase"
import { HatchEggUseCase } from "./HatchEggUseCase"

const MS_PER_HOUR = 3_600_000
const ADOPTION_TIME = new Date("2026-01-01T12:00:00Z")
const HATCH_TIME = new Date(ADOPTION_TIME.getTime() + INCUBATION_DURATION_H * MS_PER_HOUR + 1_000)
const CARE_REFRESH_TIME = new Date(HATCH_TIME.getTime() - MS_PER_HOUR)

describe("HatchEggUseCase", () => {
  let chickens: InMemoryChickenRepository
  let useCase: HatchEggUseCase
  let userId: number
  let eggId: number

  beforeEach(async() => {
    chickens = new InMemoryChickenRepository()
    const users = new InMemoryUserRepository()
    useCase = new HatchEggUseCase(chickens)

    const user = await users.create({
      username: "Coach",
      email: "a@a.com",
      passwordHash: "x", 
    })
    userId = user.id

    const { chicken } = await new AdoptEggUseCase(chickens, users).execute(
      {
        userId,
        name: "Poussin", 
      },
      ADOPTION_TIME,
    )
    eggId = chicken.id
  })

  describe("Given an egg with all care conditions OK at hatch time", () => {
    it("promotes the egg to CHICK and returns hatched", async() => {
      // Given — refresh all care 1h before hatch so they're within the 12h window
      const egg = await chickens.findById(eggId)
      await chickens.save(
        egg!
          .care("humidity", CARE_REFRESH_TIME)
          .care("temperature", CARE_REFRESH_TIME)
          .care("turn", CARE_REFRESH_TIME),
      )

      // When
      const result = await useCase.execute({
        userId,
        chickenId: eggId, 
      }, HATCH_TIME)

      // Then
      expect(result.result).toBe("hatched")
      if (result.result === "hatched") {
        expect(result.chicken.level).toBe(CHICKEN_LEVELS.CHICK)
        expect(result.chicken.hatchAt).toBeNull()
      }
    })
  })

  describe("Given an egg with stale care at hatch time", () => {
    it("deletes the egg and returns lost", async() => {
      // Given — care timestamps are from ADOPTION_TIME, 48h+ old at HATCH_TIME → all stale

      // When
      const result = await useCase.execute({
        userId,
        chickenId: eggId, 
      }, HATCH_TIME)

      // Then
      expect(result.result).toBe("lost")
      expect(await chickens.findById(eggId)).toBeNull()
    })
  })

  describe("Given an egg not ready to hatch yet", () => {
    it("throws 'Not ready to hatch yet'", async() => {
      await expect(useCase.execute({
        userId,
        chickenId: eggId, 
      }, ADOPTION_TIME))
        .rejects.toThrow("Not ready to hatch yet")
    })
  })

  describe("Given another user's egg", () => {
    it("throws 'Not your chicken'", async() => {
      await expect(useCase.execute({
        userId: 999,
        chickenId: eggId, 
      }, HATCH_TIME))
        .rejects.toThrow("Not your chicken")
    })
  })
})
