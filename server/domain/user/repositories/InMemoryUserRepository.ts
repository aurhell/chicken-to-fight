import { User } from "../entities/User"

import type { CreateUserData, IUserRepository } from "./IUserRepository"

const DEFAULT_STARTING_GOLD = 120

type StoredUser = {
  user: User
  passwordHash: string
}

export class InMemoryUserRepository implements IUserRepository {
  private readonly store = new Map<number, StoredUser>()
  private nextId = 1

  async findById(id: number): Promise<User | null> {
    return this.store.get(id)?.user ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const { user } of this.store.values()) {
      if (user.email === email) return user
    }
    return null
  }

  async findByUsername(username: string): Promise<User | null> {
    for (const { user } of this.store.values()) {
      if (user.username === username) return user
    }
    return null
  }

  async findWithHashByEmail(email: string): Promise<StoredUser | null> {
    for (const entry of this.store.values()) {
      if (entry.user.email === email) return entry
    }
    return null
  }

  async addGold(userId: number, amount: number): Promise<User> {
    const entry = this.store.get(userId)
    if (!entry) throw new Error("User not found")
    const updated = new User(entry.user.id, entry.user.username, entry.user.email, entry.user.gold + amount, entry.user.createdAt)
    this.store.set(userId, {
      ...entry,
      user: updated, 
    })
    return updated
  }

  async create(data: CreateUserData): Promise<User> {
    const id = this.nextId++
    const user = new User(id, data.username, data.email, DEFAULT_STARTING_GOLD, new Date())
    this.store.set(id, {
      user,
      passwordHash: data.passwordHash,
    })
    return user
  }
}
