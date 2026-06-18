export const CellContent = {
  CHICKEN: "CHICKEN",
  EGG: "EGG",
  CORN: "CORN",
  FEATHER: "FEATHER",
} as const

export type CellContent = typeof CellContent[keyof typeof CellContent]
