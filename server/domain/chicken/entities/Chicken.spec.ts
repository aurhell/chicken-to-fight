import { describe, expect, it } from "vitest"

import { ChickenStats } from "../value-objects/ChickenStats"
import { XPLevel } from "../value-objects/XPLevel"

import { CARE_DRIFT_H, CHICKEN_LEVELS, Chicken, INCUBATION_DURATION_H } from "./Chicken"

const MS_PER_HOUR = 3_600_000

const FIXED_NOW = new Date("2026-01-01T12:00:00Z")

function makeEgg(overrides: Partial<{
  hatchAt: Date
  humidityAdjustedAt: Date
  temperatureAdjustedAt: Date
  turnedAt: Date
}> = {}): Chicken {
  return new Chicken(
    1, 1, "Poussin", CHICKEN_LEVELS.EGG,
    new XPLevel(0), new ChickenStats(100, 100, 100, 0),
    overrides.hatchAt ?? new Date(FIXED_NOW.getTime() + INCUBATION_DURATION_H * MS_PER_HOUR),
    overrides.humidityAdjustedAt ?? FIXED_NOW,
    overrides.temperatureAdjustedAt ?? FIXED_NOW,
    overrides.turnedAt ?? FIXED_NOW,
  )
}

describe("Chicken.isEgg()", () => {
  describe("Given a chicken with level EGG and a future hatchAt", () => {
    it("returns true", () => {
      const egg = makeEgg()
      expect(egg.isEgg(FIXED_NOW)).toBe(true)
    })
  })

  describe("Given a chicken with level EGG and a past hatchAt", () => {
    it("returns false", () => {
      const egg = makeEgg({ hatchAt: new Date("2020-01-01T00:00:00Z") })
      expect(egg.isEgg(FIXED_NOW)).toBe(false)
    })
  })

  describe("Given a chicken with hatchAt null", () => {
    it("returns false", () => {
      const now = new Date()
      const chicken = new Chicken(
        1, 1, "Bob", CHICKEN_LEVELS.CHICK,
        new XPLevel(0), new ChickenStats(100, 100, 100, 0),
        null, now, now, now,
      )
      expect(chicken.isEgg()).toBe(false)
    })
  })
})

describe("Chicken.isHumidityOk()", () => {
  describe("Given humidity adjusted less than CARE_DRIFT_H ago", () => {
    it("returns true", () => {
      const now = new Date("2026-01-01T12:00:00Z")
      const egg = makeEgg({ humidityAdjustedAt: new Date(now.getTime() - (CARE_DRIFT_H - 1) * MS_PER_HOUR) })
      expect(egg.isHumidityOk(now)).toBe(true)
    })
  })

  describe("Given humidity adjusted more than CARE_DRIFT_H ago", () => {
    it("returns false", () => {
      const now = new Date("2026-01-01T12:00:00Z")
      const egg = makeEgg({ humidityAdjustedAt: new Date(now.getTime() - (CARE_DRIFT_H + 1) * MS_PER_HOUR) })
      expect(egg.isHumidityOk(now)).toBe(false)
    })
  })
})

describe("Chicken.isTemperatureOk()", () => {
  describe("Given temperature adjusted less than CARE_DRIFT_H ago", () => {
    it("returns true", () => {
      const now = new Date("2026-01-01T12:00:00Z")
      const egg = makeEgg({ temperatureAdjustedAt: new Date(now.getTime() - (CARE_DRIFT_H - 1) * MS_PER_HOUR) })
      expect(egg.isTemperatureOk(now)).toBe(true)
    })
  })

  describe("Given temperature adjusted more than CARE_DRIFT_H ago", () => {
    it("returns false", () => {
      const now = new Date("2026-01-01T12:00:00Z")
      const egg = makeEgg({ temperatureAdjustedAt: new Date(now.getTime() - (CARE_DRIFT_H + 1) * MS_PER_HOUR) })
      expect(egg.isTemperatureOk(now)).toBe(false)
    })
  })
})

describe("Chicken.isTurnedOk()", () => {
  describe("Given egg turned less than CARE_DRIFT_H ago", () => {
    it("returns true", () => {
      const now = new Date("2026-01-01T12:00:00Z")
      const egg = makeEgg({ turnedAt: new Date(now.getTime() - (CARE_DRIFT_H - 1) * MS_PER_HOUR) })
      expect(egg.isTurnedOk(now)).toBe(true)
    })
  })

  describe("Given egg turned more than CARE_DRIFT_H ago", () => {
    it("returns false", () => {
      const now = new Date("2026-01-01T12:00:00Z")
      const egg = makeEgg({ turnedAt: new Date(now.getTime() - (CARE_DRIFT_H + 1) * MS_PER_HOUR) })
      expect(egg.isTurnedOk(now)).toBe(false)
    })
  })
})

describe("Chicken.care()", () => {
  const now = new Date("2026-01-01T12:00:00Z")
  const old = new Date("2026-01-01T00:00:00Z")

  describe("Given action 'humidity'", () => {
    it("updates humidityAdjustedAt, leaves others unchanged", () => {
      const egg = makeEgg({
        humidityAdjustedAt: old,
        temperatureAdjustedAt: old,
        turnedAt: old, 
      })
      const updated = egg.care("humidity", now)
      expect(updated.humidityAdjustedAt).toEqual(now)
      expect(updated.temperatureAdjustedAt).toEqual(old)
      expect(updated.turnedAt).toEqual(old)
    })
  })

  describe("Given action 'temperature'", () => {
    it("updates temperatureAdjustedAt, leaves others unchanged", () => {
      const egg = makeEgg({
        humidityAdjustedAt: old,
        temperatureAdjustedAt: old,
        turnedAt: old, 
      })
      const updated = egg.care("temperature", now)
      expect(updated.humidityAdjustedAt).toEqual(old)
      expect(updated.temperatureAdjustedAt).toEqual(now)
      expect(updated.turnedAt).toEqual(old)
    })
  })

  describe("Given action 'turn'", () => {
    it("updates turnedAt, leaves others unchanged", () => {
      const egg = makeEgg({
        humidityAdjustedAt: old,
        temperatureAdjustedAt: old,
        turnedAt: old, 
      })
      const updated = egg.care("turn", now)
      expect(updated.humidityAdjustedAt).toEqual(old)
      expect(updated.temperatureAdjustedAt).toEqual(old)
      expect(updated.turnedAt).toEqual(now)
    })
  })
})
