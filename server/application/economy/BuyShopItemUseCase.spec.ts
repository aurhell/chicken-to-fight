import { beforeEach, describe, expect, it } from "vitest"

import { INVENTORY_ITEM } from "../../domain/economy/entities/InventoryItem"
import { InMemoryInventoryRepository } from "../../domain/economy/repositories/InMemoryInventoryRepository"
import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"

import { BuyShopItemUseCase } from "./BuyShopItemUseCase"

const STARTING_GOLD = 120

describe("BuyShopItemUseCase", () => {
  let users: InMemoryUserRepository
  let inventory: InMemoryInventoryRepository
  let useCase: BuyShopItemUseCase
  let userId: number

  beforeEach(async() => {
    users = new InMemoryUserRepository()
    inventory = new InMemoryInventoryRepository()
    useCase = new BuyShopItemUseCase(users, inventory)
    const user = await users.create({
      username: "Coach",
      email: "a@a.com",
      passwordHash: "x", 
    })
    userId = user.id
  })

  describe("Given enough gold, when buying a water trough (4 PO)", () => {
    it("deducts the price and adds 1 water to inventory", async() => {
      // When
      const result = await useCase.execute({
        userId,
        itemId: "water_trough", 
      })

      // Then
      expect(result.gold).toBe(STARTING_GOLD - 4)
      expect(result.quantity).toBe(1)
      expect(await inventory.getQuantity(userId, INVENTORY_ITEM.WATER)).toBe(1)
    })
  })

  describe("Given enough gold, when buying the same item twice", () => {
    it("accumulates quantity and deducts each time", async() => {
      // When
      await useCase.execute({
        userId,
        itemId: "water_trough", 
      })
      const result = await useCase.execute({
        userId,
        itemId: "water_trough", 
      })

      // Then
      expect(result.quantity).toBe(2)
      expect(result.gold).toBe(STARTING_GOLD - 8)
    })
  })

  describe("Given a user with insufficient gold", () => {
    it("throws 'Insufficient gold'", async() => {
      // Given: drain to 2 PO (flour costs 3)
      await users.addGold(userId, -(STARTING_GOLD - 2))

      // When / Then
      await expect(useCase.execute({
        userId,
        itemId: "flour", 
      }))
        .rejects.toThrow("Insufficient gold")
    })
  })

  describe("Given an unknown item id", () => {
    it("throws 'Unknown shop item'", async() => {
      await expect(useCase.execute({
        userId,
        itemId: "mystery_box", 
      }))
        .rejects.toThrow("Unknown shop item")
    })
  })
})
