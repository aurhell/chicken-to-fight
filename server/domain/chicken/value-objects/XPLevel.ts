export const XP_RANKS = [
  {
    xp: 0,
    rank: "Omelette pacifique", 
  },
  {
    xp: 300,
    rank: "Freluquet pitoyable", 
  },
  {
    xp: 400,
    rank: "Croquette de combat", 
  },
  {
    xp: 600,
    rank: "Bec à claque", 
  },
  {
    xp: 800,
    rank: "Fil de fer arrogant", 
  },
  {
    xp: 1000,
    rank: "Apprenti Fighter", 
  },
  {
    xp: 1200,
    rank: "Punching Chicken", 
  },
  {
    xp: 1400,
    rank: "Bec téméraire", 
  },
  {
    xp: 10000,
    rank: "Champion du ring", 
  },
  {
    xp: 80000,
    rank: "Maître incontesté", 
  },
] as const

export class XPLevel {
  constructor(public readonly value: number) {
    if (value < 0) throw new Error("XP cannot be negative")
  }

  rank(): string {
    for (let i = XP_RANKS.length - 1; i >= 0; i--) {
      const entry = XP_RANKS[i]
      if (entry && this.value >= entry.xp) return entry.rank
    }
    return XP_RANKS[0]?.rank ?? "Omelette pacifique"
  }

  add(amount: number): XPLevel {
    return new XPLevel(this.value + amount)
  }
}
