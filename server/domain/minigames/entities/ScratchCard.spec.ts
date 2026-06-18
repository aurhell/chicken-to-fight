import { describe, expect, it } from "vitest"

import { CellContent } from "../value-objects/CellContent"

import {
  DAILY_FREE_PLAYS,
  GRID_SIZE,
  WIN_REWARD_PO,
  generateGrid,
  getWinningLine,
  isWinningGrid,
} from "./ScratchCard"

describe("ScratchCard constants", () => {
  it("GRID_SIZE is 3", () => {
    expect(GRID_SIZE).toBe(3)
  })

  it("WIN_REWARD_PO is 50", () => {
    expect(WIN_REWARD_PO).toBe(50)
  })

  it("DAILY_FREE_PLAYS is 2", () => {
    expect(DAILY_FREE_PLAYS).toBe(2)
  })
})

describe("generateGrid", () => {
  describe("given a fresh game", () => {
    describe("when generating a grid", () => {
      it("then returns exactly 9 cells", () => {
        expect(generateGrid()).toHaveLength(9)
      })

      it("then contains exactly 4 chickens", () => {
        const grid = generateGrid()
        expect(grid.filter(c => c === CellContent.CHICKEN)).toHaveLength(4)
      })

      it("then all cells are valid CellContent values", () => {
        const valid = Object.values(CellContent)
        const grid = generateGrid()
        for (const cell of grid) {
          expect(valid).toContain(cell)
        }
      })
    })
  })
})

describe("isWinningGrid", () => {
  describe("given a grid with 3 aligned chickens on the first row", () => {
    describe("when checking for a win", () => {
      it("then returns true", () => {
        const grid: CellContent[] = [
          CellContent.CHICKEN,
          CellContent.CHICKEN,
          CellContent.CHICKEN,
          CellContent.EGG,
          CellContent.EGG,
          CellContent.EGG,
          CellContent.CORN,
          CellContent.CORN,
          CellContent.FEATHER,
        ]
        expect(isWinningGrid(grid)).toBe(true)
      })
    })
  })

  describe("given a grid with 3 aligned chickens on the main diagonal", () => {
    describe("when checking for a win", () => {
      it("then returns true", () => {
        const grid: CellContent[] = [
          CellContent.CHICKEN,
          CellContent.EGG,
          CellContent.EGG,
          CellContent.EGG,
          CellContent.CHICKEN,
          CellContent.EGG,
          CellContent.EGG,
          CellContent.EGG,
          CellContent.CHICKEN,
        ]
        expect(isWinningGrid(grid)).toBe(true)
      })
    })
  })

  describe("given a grid with no aligned chickens", () => {
    describe("when checking for a win", () => {
      it("then returns false", () => {
        const grid: CellContent[] = [
          CellContent.CHICKEN,
          CellContent.EGG,
          CellContent.CHICKEN,
          CellContent.CORN,
          CellContent.FEATHER,
          CellContent.CORN,
          CellContent.CHICKEN,
          CellContent.EGG,
          CellContent.CHICKEN,
        ]
        expect(isWinningGrid(grid)).toBe(false)
      })
    })
  })
})

describe("getWinningLine", () => {
  describe("given a winning grid (column 1)", () => {
    describe("when getting the winning line", () => {
      it("then returns the indices of that column", () => {
        const grid: CellContent[] = [
          CellContent.EGG,
          CellContent.CHICKEN,
          CellContent.EGG,
          CellContent.EGG,
          CellContent.CHICKEN,
          CellContent.EGG,
          CellContent.EGG,
          CellContent.CHICKEN,
          CellContent.EGG,
        ]
        expect(getWinningLine(grid)).toEqual([
          1,
          4,
          7,
        ])
      })
    })
  })

  describe("given a non-winning grid", () => {
    describe("when getting the winning line", () => {
      it("then returns null", () => {
        const grid: CellContent[] = [
          CellContent.CHICKEN,
          CellContent.EGG,
          CellContent.CHICKEN,
          CellContent.CORN,
          CellContent.FEATHER,
          CellContent.CORN,
          CellContent.CHICKEN,
          CellContent.EGG,
          CellContent.CHICKEN,
        ]
        expect(getWinningLine(grid)).toBeNull()
      })
    })
  })
})
