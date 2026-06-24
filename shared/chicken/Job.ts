export const JOB = {
  WORKER: "worker",
  BARTENDER: "bartender",
  CHEMIST: "chemist",
  DOCTOR: "doctor",
  DETECTIVE: "detective",
  BUSINESSMAN: "businessman",
  MAFIOSO: "mafioso",
  SPY: "spy",
} as const

export type JobId = (typeof JOB)[keyof typeof JOB]
 
export const JOB_COST: Record<JobId, number> = {
  [JOB.WORKER]: 0,
  [JOB.BARTENDER]: 40,
  [JOB.CHEMIST]: 200,
  [JOB.DOCTOR]: 500,
  [JOB.DETECTIVE]: 1_200,
  [JOB.BUSINESSMAN]: 2_000,
  [JOB.MAFIOSO]: 2_800,
  [JOB.SPY]: 3_500,
}

export const JOB_DAILY_INCOME: Record<JobId, number> = {
  [JOB.WORKER]: 2,
  [JOB.BARTENDER]: 4,
  [JOB.CHEMIST]: 10,
  [JOB.DOCTOR]: 20,
  [JOB.DETECTIVE]: 30,
  [JOB.BUSINESSMAN]: 50,
  [JOB.MAFIOSO]: 70,
  [JOB.SPY]: 80,
}

export const JOB_EMOJI: Record<JobId, string> = {
  [JOB.WORKER]: "🔨",
  [JOB.BARTENDER]: "🍺",
  [JOB.CHEMIST]: "🧪",
  [JOB.DOCTOR]: "🩺",
  [JOB.DETECTIVE]: "🔍",
  [JOB.BUSINESSMAN]: "💼",
  [JOB.MAFIOSO]: "💰",
  [JOB.SPY]: "🕵️",
}

export const ALL_JOB_IDS = Object.values(JOB) as JobId[]

export const XP_FOR_JOB = 1_000

export const SALARY_COOLDOWN_H = 24
