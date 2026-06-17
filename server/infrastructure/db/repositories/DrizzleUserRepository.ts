import { eq } from "drizzle-orm"

import { User } from "../../../domain/user/entities/User"
import { db } from "../index"
import { users } from "../schema/users"

import type { CreateUserData, IUserRepository } from "../../../domain/user/repositories/IUserRepository"

export class DrizzleUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    return row ? this.toEntity(row) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    return row ? this.toEntity(row) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.username, username),
    })
    return row ? this.toEntity(row) : null
  }

  async findWithHashByEmail(email: string): Promise<{ user: User; passwordHash: string } | null> {
    const row = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (!row) return null
    return {
      user: this.toEntity(row),
      passwordHash: row.passwordHash,
    }
  }

  async create(data: CreateUserData): Promise<User> {
    const [row] = await db.insert(users).values(data).returning()
    if (!row) throw new Error("Failed to create user")
    return this.toEntity(row)
  }

  private toEntity(row: typeof users.$inferSelect): User {
    return new User(row.id, row.username, row.email, row.gold, row.createdAt)
  }
}
