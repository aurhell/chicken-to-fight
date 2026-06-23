import { beforeEach, describe, expect, it } from "vitest"

import { STAGE } from "#shared/chicken/Stage"

import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"
import { InMemoryChickenRepository } from "../../domain/chicken/repositories/InMemoryChickenRepository"
import { InMemoryStageRepository } from "../../domain/chicken/repositories/InMemoryStageRepository"
import { ChickenStats } from "../../domain/chicken/value-objects/ChickenStats"
import { XPLevel } from "../../domain/chicken/value-objects/XPLevel"

import { StartStageUseCase } from "./StartStageUseCase"

const MS_PER_HOUR = 3_600_000
const NOW = new Date("2026-06-01T12:00:00Z")
const userId = 1

async function makeAdolescent(chickens: InMemoryChickenRepository) {
  return chickens.create({
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
}

describe("StartStageUseCase", () => {
  let chickens: InMemoryChickenRepository
  let stages: InMemoryStageRepository
  let useCase: StartStageUseCase
  let chickenId: number

  beforeEach(async() => {
    chickens = new InMemoryChickenRepository()
    stages = new InMemoryStageRepository()
    useCase = new StartStageUseCase(chickens, stages)
    const chicken = await makeAdolescent(chickens)
    chickenId = chicken.id
  })

  describe("Given an adolescent with no stages in progress, when starting a valid stage", () => {
    it("returns the stage record with completesAt", async() => {
      // When
      const result = await useCase.execute({
        userId,
        chickenId,
        stageId: STAGE.ATTACKS, 
      }, NOW)

      // Then — ATTACKS is 12h
      expect(result.stageId).toBe(STAGE.ATTACKS)
      expect(result.startedAt).toEqual(NOW)
      expect(result.completesAt).toEqual(new Date(NOW.getTime() + 12 * MS_PER_HOUR))
    })
  })

  describe("Given the 'look' stage (0h), when starting it", () => {
    it("completesAt equals startedAt (instant)", async() => {
      const result = await useCase.execute({
        userId,
        chickenId,
        stageId: STAGE.LOOK, 
      }, NOW)
      expect(result.completesAt).toEqual(NOW)
    })
  })

  describe("Given an already completed stage, when trying to start it again", () => {
    it("throws 'Stage already completed'", async() => {
      // Given: ATTACKS (12h) started 13h ago → completed
      const past = new Date(NOW.getTime() - 13 * MS_PER_HOUR)
      await stages.start(chickenId, STAGE.ATTACKS, past)

      // When / Then
      await expect(useCase.execute({
        userId,
        chickenId,
        stageId: STAGE.ATTACKS, 
      }, NOW))
        .rejects.toThrow("Stage already completed")
    })
  })

  describe("Given a stage in progress, when trying to start another stage", () => {
    it("throws 'A stage is already in progress'", async() => {
      // Given: DOPING (24h) started 1h ago → still in progress
      await stages.start(chickenId, STAGE.DOPING, new Date(NOW.getTime() - MS_PER_HOUR))

      // When / Then
      await expect(useCase.execute({
        userId,
        chickenId,
        stageId: STAGE.TRICKS, 
      }, NOW))
        .rejects.toThrow("A stage is already in progress")
    })
  })

  describe("Given a stage in progress, when trying to start the same stage again", () => {
    it("throws 'A stage is already in progress'", async() => {
      await stages.start(chickenId, STAGE.DOPING, new Date(NOW.getTime() - MS_PER_HOUR))

      await expect(useCase.execute({
        userId,
        chickenId,
        stageId: STAGE.DOPING, 
      }, NOW))
        .rejects.toThrow("A stage is already in progress")
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
        stageId: STAGE.ATTACKS, 
      }, NOW))
        .rejects.toThrow("Not an adolescent")
    })
  })

  describe("Given another user's chicken", () => {
    it("throws 'Not your chicken'", async() => {
      await expect(useCase.execute({
        userId: 999,
        chickenId,
        stageId: STAGE.ATTACKS, 
      }, NOW))
        .rejects.toThrow("Not your chicken")
    })
  })

  describe("Given an unknown stage id", () => {
    it("throws 'Unknown stage'", async() => {
      await expect(useCase.execute({
        userId,
        chickenId,
        stageId: "mystery_stage", 
      }, NOW))
        .rejects.toThrow("Unknown stage")
    })
  })
})
