const STAT_MAX = 100
const STAT_MIN = 0

export class ChickenStats {
  constructor(
    public readonly hunger: number,
    public readonly thirst: number,
    public readonly happiness: number,
    public readonly fatigue: number,
  ) {
    if ([
      hunger,
      thirst,
      happiness,
    ].some(v => v < STAT_MIN || v > STAT_MAX))
      throw new Error("Stats must be between 0 and 100")
    if (fatigue < STAT_MIN || fatigue > STAT_MAX)
      throw new Error("Fatigue must be between 0 and 100")
  }

  isAlive(): boolean {
    return this.hunger > STAT_MIN && this.thirst > STAT_MIN
  }

  withFatigue(fatigue: number): ChickenStats {
    return new ChickenStats(this.hunger, this.thirst, this.happiness, fatigue)
  }
}
