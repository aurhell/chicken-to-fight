export { HUNGER_DRAIN_H, THIRST_DRAIN_H } from "#shared/chicken/ChickenConstants"

const MS_PER_HOUR = 3_600_000

export function careBarPct(lastCaredAt: string | null, drainH: number, now: number): number {
  if (!lastCaredAt) return 0
  const elapsed = now - new Date(lastCaredAt).getTime()
  return Math.max(0, Math.min(100, Math.round((1 - elapsed / (drainH * MS_PER_HOUR)) * 100)))
}
