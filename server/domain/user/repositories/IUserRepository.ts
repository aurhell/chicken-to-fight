import type { User } from "../entities/User"

export type CreateUserData = {
  username: string
  email: string
  passwordHash: string
}

export type IUserRepository = {
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  findWithHashByEmail(email: string): Promise<{ user: User; passwordHash: string } | null>
  create(data: CreateUserData): Promise<User>
  addGold(userId: number, amount: number): Promise<User>
}
