import { beforeEach, describe, expect, it, vi } from "vitest"

import { InMemoryUserRepository } from "../../domain/user/repositories/InMemoryUserRepository"

import { RegisterUseCase } from "./RegisterUseCase"

vi.mock("@node-rs/argon2", () => ({
  hash: vi.fn(async(pwd: string) => `hashed:${pwd}`),
  verify: vi.fn(async(hash: string, pwd: string) => hash === `hashed:${pwd}`),
}))

describe("RegisterUseCase", () => {
  let repo: InMemoryUserRepository
  let useCase: RegisterUseCase

  beforeEach(() => {
    repo = new InMemoryUserRepository()
    useCase = new RegisterUseCase(repo)
  })

  describe("given a valid registration request", () => {
    describe("when registering", () => {
      it("then should create and return the user", async() => {
        const user = await useCase.execute("alice", "alice@example.com", "password123")
        expect(user.username).toBe("alice")
        expect(user.email).toBe("alice@example.com")
        expect(user.id).toBe(1)
      })

      it("then should store a hashed password, never the plain text", async() => {
        await useCase.execute("alice", "alice@example.com", "password123")
        const entry = await repo.findWithHashByEmail("alice@example.com")
        expect(entry?.passwordHash).toBe("hashed:password123")
        expect(entry?.passwordHash).not.toBe("password123")
      })
    })
  })

  describe("given an email already in use", () => {
    describe("when registering with that email", () => {
      it("then should throw", async() => {
        await useCase.execute("alice", "alice@example.com", "password123")
        await expect(
          useCase.execute("bob", "alice@example.com", "password456"),
        ).rejects.toThrow("Email already taken")
      })
    })
  })

  describe("given a username already in use", () => {
    describe("when registering with that username", () => {
      it("then should throw", async() => {
        await useCase.execute("alice", "alice@example.com", "password123")
        await expect(
          useCase.execute("alice", "bob@example.com", "password456"),
        ).rejects.toThrow("Username already taken")
      })
    })
  })

  describe("given a password shorter than 8 characters", () => {
    describe("when registering", () => {
      it("then should throw", async() => {
        await expect(
          useCase.execute("alice", "alice@example.com", "short"),
        ).rejects.toThrow("Password must be at least 8 characters")
      })
    })
  })
})
