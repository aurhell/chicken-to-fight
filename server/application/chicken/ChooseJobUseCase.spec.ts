import { beforeEach, describe, expect, it } from "vitest"

import { JOB, JOB_COST, JOB_DAILY_INCOME, XP_FOR_JOB } from "#shared/chicken/Job"

import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"
import { InMemoryChickenRepository } from "../../domain/chicken/repositories/InMemoryChickenRepository"
import { ChickenStats } from "../../domain/chicken/value-objects/ChickenStats"
import { XPLevel } from "../../domain/chicken/value-objects/XPLevel"
import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"

import { ChooseJobUseCase } from "./ChooseJobUseCase"

const NOW = new Date("2026-06-01T12:00:00Z")

describe("ChooseJobUseCase", () => {
  let chickens: InMemoryChickenRepository
  let users: InMemoryUserRepository
  let useCase: ChooseJobUseCase
  let userId: number

  beforeEach(async() => {
    chickens = new InMemoryChickenRepository()
    users = new InMemoryUserRepository()
    const user = await users.create({
      username: "trainer",
      email: "t@t.com",
      passwordHash: "h",
      gold: 5_000, 
    })
    userId = user.id
    useCase = new ChooseJobUseCase(chickens, users)
  })

  async function makeApprenticeFighter(overrides: {
    xp?: number
    jobId?: (typeof JOB)[keyof typeof JOB] | null
    ownerId?: number
  } = {}) {
    return chickens.create({
      userId: overrides.ownerId ?? userId,
      name: "Cocotte",
      level: CHICKEN_LEVELS.APPRENTICE,
      xp: new XPLevel(overrides.xp ?? XP_FOR_JOB),
      stats: new ChickenStats(100, 100, 100, 0),
      hatchAt: null,
      fedAt: null,
      wateredAt: null,
      humidityAdjustedAt: NOW,
      temperatureAdjustedAt: NOW,
      turnedAt: NOW,
      jobId: overrides.jobId !== undefined ? overrides.jobId : null,
    })
  }

  describe("Given a valid APPRENTICE with enough XP and gold", () => {
    it("assigns the job and deducts training cost", async() => {
      const chicken = await makeApprenticeFighter()
      const result = await useCase.execute({
        userId,
        chickenId: chicken.id,
        jobId: JOB.BARTENDER, 
      }, NOW)

      expect(result.jobId).toBe(JOB.BARTENDER)
      expect(result.dailyIncome).toBe(JOB_DAILY_INCOME[JOB.BARTENDER])

      const saved = await chickens.findById(chicken.id)
      expect(saved?.jobId).toBe(JOB.BARTENDER)

      const user = await users.findById(userId)
      expect(user?.gold).toBe(5_000 - JOB_COST[JOB.BARTENDER])
    })

    it("assigns a free job without changing gold", async() => {
      const chicken = await makeApprenticeFighter()
      await useCase.execute({
        userId,
        chickenId: chicken.id,
        jobId: JOB.WORKER, 
      }, NOW)

      const user = await users.findById(userId)
      expect(user?.gold).toBe(5_000)
    })
  })

  describe("Given a chicken that does not belong to the user", () => {
    it("throws Not your chicken", async() => {
      const other = await users.create({
        username: "other",
        email: "o@o.com",
        passwordHash: "h", 
      })
      const chicken = await makeApprenticeFighter({ ownerId: other.id })
      await expect(
        useCase.execute({
          userId,
          chickenId: chicken.id,
          jobId: JOB.BARTENDER, 
        }, NOW),
      ).rejects.toThrow("Not your chicken")
    })
  })

  describe("Given a chicken that is not APPRENTICE level", () => {
    it("throws Chicken must be APPRENTICE level", async() => {
      const chicken = await chickens.create({
        userId,
        name: "Ado",
        level: CHICKEN_LEVELS.ADOLESCENT,
        xp: new XPLevel(XP_FOR_JOB),
        stats: new ChickenStats(100, 100, 100, 0),
        hatchAt: null,
        fedAt: null,
        wateredAt: null,
        humidityAdjustedAt: NOW,
        temperatureAdjustedAt: NOW,
        turnedAt: NOW,
      })
      await expect(
        useCase.execute({
          userId,
          chickenId: chicken.id,
          jobId: JOB.BARTENDER, 
        }, NOW),
      ).rejects.toThrow("Chicken must be APPRENTICE level")
    })
  })

  describe("Given a chicken that already has a job", () => {
    it("throws Chicken already has a job", async() => {
      const chicken = await makeApprenticeFighter({ jobId: JOB.WORKER })
      await expect(
        useCase.execute({
          userId,
          chickenId: chicken.id,
          jobId: JOB.BARTENDER, 
        }, NOW),
      ).rejects.toThrow("Chicken already has a job")
    })
  })

  describe("Given a chicken with insufficient XP", () => {
    it("throws Not enough XP", async() => {
      const chicken = await makeApprenticeFighter({ xp: XP_FOR_JOB - 1 })
      await expect(
        useCase.execute({
          userId,
          chickenId: chicken.id,
          jobId: JOB.BARTENDER, 
        }, NOW),
      ).rejects.toThrow("Not enough XP")
    })
  })

  describe("Given a user with insufficient gold for the training cost", () => {
    it("throws Not enough gold", async() => {
      const poorUser = await users.create({
        username: "poor",
        email: "p@p.com",
        passwordHash: "h",
        gold: 0, 
      })
      const chicken = await makeApprenticeFighter({ ownerId: poorUser.id })
      await expect(
        useCase.execute({
          userId: poorUser.id,
          chickenId: chicken.id,
          jobId: JOB.BARTENDER, 
        }, NOW),
      ).rejects.toThrow("Not enough gold")
    })
  })

  describe("Given an invalid job id", () => {
    it("throws Invalid job", async() => {
      const chicken = await makeApprenticeFighter()
      await expect(
        useCase.execute({
          userId,
          chickenId: chicken.id,
          jobId: "invalid" as (typeof JOB)[keyof typeof JOB], 
        }, NOW),
      ).rejects.toThrow("Invalid job")
    })
  })
})
