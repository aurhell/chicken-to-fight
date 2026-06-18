import { describe, expect, it } from "vitest"

import { resolveAuthRedirect } from "./resolveAuthRedirect"

import type { AuthUser } from "../types/auth"

const STARTING_GOLD = 120

const alice: AuthUser = {
  id: 1,
  username: "alice",
  email: "alice@example.com",
  gold: STARTING_GOLD,
}

describe("resolveAuthRedirect", () => {
  describe("given an unauthenticated user", () => {
    describe("when visiting a protected route", () => {
      it("then should redirect to /login", () => {
        expect(resolveAuthRedirect(null, "dashboard")).toBe("/login")
      })
    })

    describe("when visiting a public route", () => {
      it("then should not redirect", () => {
        expect(resolveAuthRedirect(null, "login")).toBeNull()
        expect(resolveAuthRedirect(null, "register")).toBeNull()
      })
    })
  })

  describe("given an authenticated user", () => {
    describe("when visiting a public route", () => {
      it("then should redirect to /dashboard", () => {
        expect(resolveAuthRedirect(alice, "login")).toBe("/dashboard")
        expect(resolveAuthRedirect(alice, "register")).toBe("/dashboard")
      })
    })

    describe("when visiting a protected route", () => {
      it("then should not redirect", () => {
        expect(resolveAuthRedirect(alice, "dashboard")).toBeNull()
      })
    })
  })
})
