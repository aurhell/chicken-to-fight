import { INVENTORY_ITEM } from "./InventoryItem"

export type ShopItem = {
  id: string
  inventoryKey: string
  price: number
}

export const SHOP_ITEMS_FOOD: ShopItem[] = [
  {
    id: "water_trough",
    inventoryKey: INVENTORY_ITEM.WATER,
    price: 4, 
  },
  {
    id: "flour",
    inventoryKey: INVENTORY_ITEM.FLOUR,
    price: 3, 
  },
  {
    id: "seeds",
    inventoryKey: INVENTORY_ITEM.SEEDS,
    price: 5, 
  },
  {
    id: "beer",
    inventoryKey: INVENTORY_ITEM.BEER,
    price: 5, 
  },
  {
    id: "treats",
    inventoryKey: INVENTORY_ITEM.TREATS,
    price: 4, 
  },
]
