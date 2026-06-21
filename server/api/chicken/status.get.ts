import { CHICKEN_LEVELS } from "../../domain/chicken/entities/Chicken"
import { INVENTORY_ITEM } from "../../domain/economy/entities/InventoryItem"
import { requireAuth } from "../../infrastructure/auth/session"
import { DrizzleChickenRepository } from "../../infrastructure/db/repositories/DrizzleChickenRepository"
import { DrizzleInventoryRepository } from "../../infrastructure/db/repositories/DrizzleInventoryRepository"

export default defineEventHandler(async(event) => {
  const userId = await requireAuth(event)
  const chickenRepo = new DrizzleChickenRepository()
  const inventoryRepo = new DrizzleInventoryRepository()

  const [
    allChickens,
    inv,
  ] = await Promise.all([
    chickenRepo.findByUserId(userId),
    inventoryRepo.getAll(userId),
  ])
  const now = new Date()

  const eggs = allChickens.filter(c => c.isEgg(now))

  const living = allChickens.filter(c =>
    c.level === CHICKEN_LEVELS.CHICK || c.level === CHICKEN_LEVELS.ADOLESCENT,
  )

  let chickenDied = false

  const chicks = await Promise.all(living.map(async c => {
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

  const liveChicks = chicks.filter(c => c !== null)

  return {
    eggs: eggs.map(e => ({
      id: e.id,
      name: e.name,
      hatchAt: e.hatchAt,
      humidityOk: e.isHumidityOk(now),
      temperatureOk: e.isTemperatureOk(now),
      turnedOk: e.isTurnedOk(now),
    })),
    chicks: liveChicks.map(c => ({
      id: c.id,
      name: c.name,
      level: c.level,
      bornAt: c.hatchAt,
      fedAt: c.fedAt,
      wateredAt: c.wateredAt,
    })),
    chickenDied,
    resources: {
      water: inv[INVENTORY_ITEM.WATER] ?? 0,
      flour: inv[INVENTORY_ITEM.FLOUR] ?? 0,
    },
  }
})
