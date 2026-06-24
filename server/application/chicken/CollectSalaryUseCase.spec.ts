import { beforeEach, describe, expect, it } from "vitest"

import { JOB, JOB_DAILY_INCOME, SALARY_COOLDOWN_H } from "#shared/chicken/Job"

import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"
import { InMemoryChickenRepository } from "../../domain/chicken/repositories/InMemoryChickenRepository"
import { ChickenStats } from "../../domain/chicken/value-objects/ChickenStats"
import { XPLevel } from "../../domain/chicken/value-objects/XPLevel"
import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"

import { CollectSalaryUseCase } from "./CollectSalaryUseCase"

const MS_PER_HOUR = 3_600_000
const NOW = new Date("2026-06-01T12:00:00Z")
const YESTERDAY = new Date(NOW.getTime() - (SALARY_COOLDOWN_H + 1) * MS_PER_HOUR)
const STARTING_GOLD = 100

describe("CollectSalaryUseCase", () => {
  let chickens: InMemoryChickenRepository
  let users: InMemoryUserRepository
  let useCase: CollectSalaryUseCase
  let userId: number

  beforeEach(async() => {
    chickens = new InMemoryChickenRepository()
    users = new InMemoryUserRepository()
    const user = await users.create({
      username: "trainer",
      email: "t@t.com",
      passwordHash: "h",
      gold: STARTING_GOLD, 
    })
    userId = user.id
    useCase = new CollectSalaryUseCase(chickens, users)
  })

  async function makeFighter(overrides: {
    jobId?: (typeof JOB)[keyof typeof JOB] | null
    lastSalaryAt?: Date | null
    ownerId?: number
  } = {}) {
    return chickens.create({
      userId: overrides.ownerId ?? userId,
      name: "Cocotte",
      level: CHICKEN_LEVELS.APPRENTICE,
      xp: new XPLevel(1_000),
      stats: new ChickenStats(100, 100, 100, 0),
      hatchAt: null,
      fedAt: null,
      wateredAt: null,
      humidityAdjustedAt: NOW,
      temperatureAdjustedAt: NOW,
      turnedAt: NOW,
      jobId: overrides.jobId !== undefined ? overrides.jobId : JOB.BARTENDER,
      lastSalaryAt: overrides.lastSalaryAt !== undefined ? overrides.lastSalaryAt : null,
    })
  }

  describe("Given a fighter with a job and no previous collection", () => {
    it("adds daily income to user gold and records lastSalaryAt", async() => {
      const chicken = await makeFighter()
      const result = await useCase.execute({
        userId,
        chickenId: chicken.id, 
      }, NOW)

      expect(result.goldEarned).toBe(JOB_DAILY_INCOME[JOB.BARTENDER])
      expect(result.newGold).toBe(STARTING_GOLD + JOB_DAILY_INCOME[JOB.BARTENDER])

      const saved = await chickens.findById(chicken.id)
      expect(saved?.lastSalaryAt).toEqual(NOW)
    })
  })

  describe("Given a fighter whose last collection was more than 24h ago", () => {
    it("allows collection", async() => {
      const chicken = await makeFighter({ lastSalaryAt: YESTERDAY })
      const result = await useCase.execute({
        userId,
        chickenId: chicken.id, 
      }, NOW)

      expect(result.goldEarned).toBe(JOB_DAILY_INCOME[JOB.BARTENDER])
    })
  })

  describe("Given a fighter whose last collection was less than 24h ago", () => {
    it("throws Salary already collected today", async() => {
      const recent = new Date(NOW.getTime() - (SALARY_COOLDOWN_H - 1) * MS_PER_HOUR)
      const chicken = await makeFighter({ lastSalaryAt: recent })
      await expect(
        useCase.execute({
          userId,
          chickenId: chicken.id, 
        }, NOW),
      ).rejects.toThrow("Salary already collected today")
    })
  })

  describe("Given a fighter with no job", () => {
    it("throws Chicken has no job", async() => {
      const chicken = await makeFighter({ jobId: null })
      await expect(
        useCase.execute({
          userId,
          chickenId: chicken.id, 
        }, NOW),
      ).rejects.toThrow("Chicken has no job")
    })
  })

  describe("Given a chicken that does not belong to the user", () => {
    it("throws Not your chicken", async() => {
      const other = await users.create({
        username: "other",
        email: "o@o.com",
        passwordHash: "h", 
      })
      const chicken = await makeFighter({ ownerId: other.id })
      await expect(
        useCase.execute({
          userId,
          chickenId: chicken.id, 
        }, NOW),
      ).rejects.toThrow("Not your chicken")
    })
  })
})
