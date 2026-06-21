import { SHOP_ITEMS_FOOD } from "#shared/economy/ShopItem"

import type { IInventoryRepository } from "../../domain/economy/repositories/IInventoryRepository"
import type { IUserRepository } from "../../domain/user/repositories/IUserRepository"

export type BuyShopItemInput = {
  userId: number
  itemId: string
}

export type BuyShopItemResult = {
  gold: number
  quantity: number
}

export class BuyShopItemUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly inventory: IInventoryRepository,
  ) {}

  async execute(input: BuyShopItemInput): Promise<BuyShopItemResult> {
    const item = SHOP_ITEMS_FOOD.find(i => i.id === input.itemId)
    if (!item) throw new Error("Unknown shop item")

    const user = await this.users.findById(input.userId)
    if (!user) throw new Error("User not found")
    if (user.gold < item.price) throw new Error("Insufficient gold")

    const updatedUser = await this.users.addGold(input.userId, -item.price)
    const quantity = await this.inventory.add(input.userId, item.inventoryKey, 1)

    return {
      gold: updatedUser.gold,
      quantity, 
    }
  }
}
