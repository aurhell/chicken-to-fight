import { beforeEach, describe, expect, it, vi } from "vitest"

import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"

import { LoginUseCase } from "./LoginUseCase"
import { RegisterUseCase } from "./RegisterUseCase"

vi.mock("@node-rs/argon2", () => ({
  hash: vi.fn(async(pwd: string) => `hashed:${pwd}`),
  verify: vi.fn(async(hash: string, pwd: string) => hash === `hashed:${pwd}`),
}))

describe("LoginUseCase", () => {
  let repo: InMemoryUserRepository
  let loginUseCase: LoginUseCase

  beforeEach(async() => {
    repo = new InMemoryUserRepository()
    loginUseCase = new LoginUseCase(repo)
    await new RegisterUseCase(repo).execute("alice", "alice@example.com", "password123")
  })

  describe("given a registered user", () => {
    describe("when logging in with valid credentials", () => {
      it("then should return the user", async() => {
        const user = await loginUseCase.execute("alice@example.com", "password123")
        expect(user.username).toBe("alice")
        expect(user.email).toBe("alice@example.com")
      })
    })

    describe("when logging in with a wrong password", () => {
      it("then should throw 'Invalid credentials'", async() => {
        await expect(
          loginUseCase.execute("alice@example.com", "wrongpassword"),
        ).rejects.toThrow("Invalid credentials")
      })
    })
  })

  describe("given an unknown email", () => {
    describe("when logging in", () => {
      it("then should throw 'Invalid credentials'", async() => {
        await expect(
          loginUseCase.execute("unknown@example.com", "password123"),
        ).rejects.toThrow("Invalid credentials")
      })
    })
  })
})
