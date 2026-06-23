export const STAGE = {
  SELF_DEFENSE: "self_defense",
  LOOK: "look",
  DOPING: "doping",
  ATTACKS: "attacks",
  MANNERS: "manners",
  HISTORY: "history",
  TRICKS: "tricks",
} as const

export type StageId = typeof STAGE[keyof typeof STAGE]
 
export const STAGE_DURATION_H: Record<StageId, number> = {
  [STAGE.SELF_DEFENSE]: 48,
  [STAGE.LOOK]: 0,
  [STAGE.DOPING]: 24,
  [STAGE.ATTACKS]: 12,
  [STAGE.MANNERS]: 48,
  [STAGE.HISTORY]: 24,
  [STAGE.TRICKS]: 48,
}

export const STAGES_REQUIRED = 6
export const ALL_STAGE_IDS = Object.values(STAGE) as StageId[]
