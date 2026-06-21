export const CHICKEN_LEVELS = {
  EGG: 1,
  CHICK: 2,
  ADOLESCENT: 3,
  APPRENTICE: 4,
  CHAMPION: 5,
  MASTER: 6,
  LEGEND: 7,
  RETIRED: 8,
  IMMORTAL: 9,
} as const

export type ChickenLevel = typeof CHICKEN_LEVELS[keyof typeof CHICKEN_LEVELS]
