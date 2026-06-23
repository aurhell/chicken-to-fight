import { beforeEach, describe, expect, it } from "vitest"

import { STAGE } from "#shared/chicken/Stage"

import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"
import { InMemoryChickenRepository } from "../../domain/chicken/repositories/InMemoryChickenRepository"
import { InMemoryStageRepository } from "../../domain/chicken/repositories/InMemoryStageRepository"
import { ChickenStats } from "../../domain/chicken/value-objects/ChickenStats"
import { XPLevel } from "../../domain/chicken/value-objects/XPLevel"

import { GraduateAdolescentUseCase } from "./GraduateAdolescentUseCase"

const MS_PER_HOUR = 3_600_000
const NOW = new Date("2026-06-01T12:00:00Z")
const LONG_AGO = new Date(NOW.getTime() - 50 * MS_PER_HOUR)
const userId = 1

const SIX_STAGES = [
  STAGE.SELF_DEFENSE,
  STAGE.LOOK,
  STAGE.DOPING,
  STAGE.ATTACKS,
  STAGE.MANNERS,
  STAGE.HISTORY,
]

describe("GraduateAdolescentUseCase", () => {
  let chickens: InMemoryChickenRepository
  let stages: InMemoryStageRepository
  let useCase: GraduateAdolescentUseCase
  let chickenId: number

  beforeEach(async() => {
    chickens = new InMemoryChickenRepository()
    stages = new InMemoryStageRepository()
    useCase = new GraduateAdolescentUseCase(chickens, stages)
    const chicken = await chickens.create({
      userId,
      name: "Cocotte",
      level: CHICKEN_LEVELS.ADOLESCENT,
      xp: new XPLevel(0),
      stats: new ChickenStats(100, 100, 100, 0),
      hatchAt: null,
      fedAt: null,
      wateredAt: null,
      humidityAdjustedAt: NOW,
      temperatureAdjustedAt: NOW,
      turnedAt: NOW,
    })
    chickenId = chicken.id
  })

  describe("Given exactly 6 completed stages, when graduating", () => {
    it("promotes the chicken to APPRENTICE", async() => {
      // Given: 6 stages started long ago → all completed
      for (const stageId of SIX_STAGES) {
        await stages.start(chickenId, stageId, LONG_AGO)
      }

      // When
      const result = await useCase.execute({
        userId,
        chickenId, 
      }, NOW)

      // Then
      expect(result.level).toBe(CHICKEN_LEVELS.APPRENTICE)
      const saved = await chickens.findById(chickenId)
      expect(saved?.level).toBe(CHICKEN_LEVELS.APPRENTICE)
    })
  })

  describe("Given only 5 completed stages, when graduating", () => {
    it("throws 'Not enough stages completed'", async() => {
      for (const stageId of SIX_STAGES.slice(0, 5)) {
        await stages.start(chickenId, stageId, LONG_AGO)
      }

      await expect(useCase.execute({
        userId,
        chickenId, 
      }, NOW))
        .rejects.toThrow("Not enough stages completed")
    })
  })

  describe("Given 6 stages started but one still in progress, when graduating", () => {
    it("throws 'Not enough stages completed'", async() => {
      // 5 completed long ago
      for (const stageId of SIX_STAGES.slice(0, 5)) {
        await stages.start(chickenId, stageId, LONG_AGO)
      }
      // HISTORY (24h) started only 1h ago → still in progress
      await stages.start(chickenId, STAGE.HISTORY, new Date(NOW.getTime() - MS_PER_HOUR))

      await expect(useCase.execute({
        userId,
        chickenId, 
      }, NOW))
        .rejects.toThrow("Not enough stages completed")
    })
  })

  describe("Given a non-adolescent chicken", () => {
    it("throws 'Not an adolescent'", async() => {
      const chick = await chickens.create({
        userId,
        name: "Poussin",
        level: CHICKEN_LEVELS.CHICK,
        xp: new XPLevel(0),
        stats: new ChickenStats(100, 100, 100, 0),
        hatchAt: null,
        fedAt: null,
        wateredAt: null,
        humidityAdjustedAt: NOW,
        temperatureAdjustedAt: NOW,
        turnedAt: NOW,
      })
      await expect(useCase.execute({
        userId,
        chickenId: chick.id, 
      }, NOW))
        .rejects.toThrow("Not an adolescent")
    })
  })

  describe("Given another user's chicken", () => {
    it("throws 'Not your chicken'", async() => {
      await expect(useCase.execute({
        userId: 999,
        chickenId, 
      }, NOW))
        .rejects.toThrow("Not your chicken")
    })
  })
})
