import { CellContent } from "../value-objects/CellContent"

export const GRID_SIZE = 3
export const WIN_REWARD_PO = 50
export const DAILY_FREE_PLAYS = 2

export type Grid = CellContent[]

// All 8 possible winning lines (rows, columns, diagonals)
/* eslint-disable no-magic-numbers */
export const WINNING_LINES = [
  [
    0,
    1,
    2,
  ],
  [
    3,
    4,
    5,
  ],
  [
    6,
    7,
    8,
  ],
  [
    0,
    3,
    6,
  ],
  [
    1,
    4,
    7,
  ],
  [
    2,
    5,
    8,
  ],
  [
    0,
    4,
    8,
  ],
  [
    2,
    4,
    6,
  ],
] as const
/* eslint-enable no-magic-numbers */

export function generateGrid(): Grid {
  // 4 chickens in 9 cells → ~35% win probability
  const cells: CellContent[] = [
    CellContent.CHICKEN,
    CellContent.CHICKEN,
    CellContent.CHICKEN,
    CellContent.CHICKEN,
    CellContent.EGG,
    CellContent.EGG,
    CellContent.EGG,
    CellContent.CORN,
    CellContent.FEATHER,
  ]
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[
      cells[i],
      cells[j],
    ] = [
      cells[j]!,
      cells[i]!,
    ]
  }
  return cells
}

export function isWinningGrid(grid: Grid): boolean {
  return WINNING_LINES.some(line => line.every(i => grid[i] === CellContent.CHICKEN))
}

export function getWinningLine(grid: Grid): readonly number[] | null {
  return WINNING_LINES.find(line => line.every(i => grid[i] === CellContent.CHICKEN)) ?? null
}
