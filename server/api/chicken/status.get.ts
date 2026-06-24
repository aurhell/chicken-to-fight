import { ALL_STAGE_IDS, STAGE_DURATION_H, STAGES_REQUIRED, type StageId } from "#shared/chicken/Stage"

import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"
import { INVENTORY_ITEM } from "../../domain/economy/entities/InventoryItem"
import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../infrastructure/db/repositories/DrizzleChickenRepository"
import { DrizzleInventoryRepository } from "../../infrastructure/db/repositories/DrizzleInventoryRepository"
import { DrizzleStageRepository } from "../../infrastructure/db/repositories/DrizzleStageRepository"

const MS_PER_HOUR = 3_600_000

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenRepo = new DrizzleChickenRepository()
  const inventoryRepo = new DrizzleInventoryRepository()
  const stageRepo = new DrizzleStageRepository()

  const [
    allChickens,
    inv,
  ] = await Promise.all([
    chickenRepo.findByUserId(userId),
    inventoryRepo.getAll(userId),
  ])
  const now = new Date()

  const eggs = allChickens.filter(c => c.isEgg(now))

  const living = allChickens.filter(c => c.level > CHICKEN_LEVELS.EGG && !c.isEgg(now))

  let chickenDied = false

  const grown = await Promise.all(living.map(async c => {
    if (c.isDead(now)) {
      await chickenRepo.delete(c.id)
      chickenDied = true
      return null
    }
    if (c.isReadyToGrow(now)) {
      return await chickenRepo.save(c.grow())
    }
    return c
  }))

  const liveChicks = grown.filter(c => c !== null)

  const chicks = await Promise.all(liveChicks.map(async c => {
    let stages: {
      stageId: string
      status: "not_started" | "in_progress" | "completed"
      startedAt: string | null
      completesAt: string | null
    }[] = []
    let canGraduate = false

    if (c.level === CHICKEN_LEVELS.ADOLESCENT) {
      const records = await stageRepo.findByChickenId(c.id)
      stages = ALL_STAGE_IDS.map(stageId => {
        const record = records.find(r => r.stageId === stageId)
        if (!record) return {
          stageId,
          status: "not_started" as const,
          startedAt: null,
          completesAt: null,
        }
        const durationMs = STAGE_DURATION_H[stageId as StageId] * MS_PER_HOUR
        const completesAt = new Date(record.startedAt.getTime() + durationMs)
        const completed = now >= completesAt
        return {
          stageId,
          status: (completed ? "completed" : "in_progress") as "completed" | "in_progress",
          startedAt: record.startedAt.toISOString(),
          completesAt: completesAt.toISOString(),
        }
      })
      const completedCount = stages.filter(s => s.status === "completed").length
      canGraduate = completedCount >= STAGES_REQUIRED
    }

    return {
      id: c.id,
      name: c.name,
      level: c.level,
      xp: c.xp.value,
      bornAt: c.hatchAt,
      fedAt: c.fedAt,
      wateredAt: c.wateredAt,
      stages,
      canGraduate,
      jobId: c.jobId,
      lastSalaryAt: c.lastSalaryAt?.toISOString() ?? null,
      canCollectSalary: c.canCollectSalary(now),
    }
  }))

  return {
    eggs: eggs.map(e => ({
      id: e.id,
      name: e.name,
      hatchAt: e.hatchAt,
      humidityOk: e.isHumidityOk(now),
      temperatureOk: e.isTemperatureOk(now),
      turnedOk: e.isTurnedOk(now),
    })),
    chicks,
    chickenDied,
    resources: {
      water: inv[INVENTORY_ITEM.WATER] ?? 0,
      flour: inv[INVENTORY_ITEM.FLOUR] ?? 0,
    },
  }
})
