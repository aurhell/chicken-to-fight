import { hash } from "@node-rs/argon2"

import type { IUserRepository } from "../../domain/user/repositories/IUserRepository"

const MIN_PASSWORD_LENGTH = 8

export class RegisterUseCase {
  constructor(private readonly users: IUserRepository) {}

  async execute(username: string, email: string, password: string) {
    if (password.length < MIN_PASSWORD_LENGTH)
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)

    if (await this.users.findByEmail(email))
      throw new Error("Email already taken")

    if (await this.users.findByUsername(username))
      throw new Error("Username already taken")

    const passwordHash = await hash(password)
    return this.users.create({
      username,
      email,
      passwordHash,
    })
  }
}
