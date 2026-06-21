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

  const egg = allChickens.find(c => c.isEgg(now)) ?? null

  let living = allChickens.find(c =>
    c.level === CHICKEN_LEVELS.CHICK || c.level === CHICKEN_LEVELS.ADOLESCENT,
  ) ?? null

  let chickenDied = false

  if (living?.isDead(now)) {
    await chickenRepo.delete(living.id)
    living = null
    chickenDied = true
  } else if (living?.isReadyToGrow(now)) {
    living = await chickenRepo.save(living.grow())
  }

  return {
    egg: egg
      ? {
        id: egg.id,
        name: egg.name,
        hatchAt: egg.hatchAt,
        humidityOk: egg.isHumidityOk(now),
        temperatureOk: egg.isTemperatureOk(now),
        turnedOk: egg.isTurnedOk(now),
      }
      : null,
    chick: living
      ? {
        id: living.id,
        name: living.name,
        level: living.level,
        bornAt: living.hatchAt,
        fedAt: living.fedAt,
        wateredAt: living.wateredAt,
      }
      : null,
    chickenDied,
    resources: {
      water: inv[INVENTORY_ITEM.WATER] ?? 0,
      flour: inv[INVENTORY_ITEM.FLOUR] ?? 0,
    },
  }
})
