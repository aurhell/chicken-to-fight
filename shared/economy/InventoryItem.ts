export const INVENTORY_ITEM = {
  WATER: "water",
  FLOUR: "flour",
  SEEDS: "seeds",
  BEER: "beer",
  TREATS: "treats",
} as const

export type InventoryItemType = typeof INVENTORY_ITEM[keyof typeof INVENTORY_ITEM]

export const INVENTORY_ITEM_ICONS: Record<string, string> = {
  [INVENTORY_ITEM.WATER]: "💧",
  [INVENTORY_ITEM.FLOUR]: "🌾",
  [INVENTORY_ITEM.SEEDS]: "🌱",
  [INVENTORY_ITEM.BEER]: "🍺",
  [INVENTORY_ITEM.TREATS]: "🍬",
}

export const INVENTORY_ITEM_DESCRIPTIONS: Record<string, string> = {
  [INVENTORY_ITEM.WATER]: "Hydrates your chicken",
  [INVENTORY_ITEM.FLOUR]: "Strengthens your chicken",
  [INVENTORY_ITEM.SEEDS]: "Feeds your chicken",
  [INVENTORY_ITEM.BEER]: "Quenches your chicken's thirst",
  [INVENTORY_ITEM.TREATS]: "Increases happiness",
}
