export const INVENTORY_ITEM = {
  WATER: "water",
  FLOUR: "flour",
} as const

export type InventoryItemType = typeof INVENTORY_ITEM[keyof typeof INVENTORY_ITEM]
