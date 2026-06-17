import { verify } from "@node-rs/argon2"

import type { IUserRepository } from "../../domain/user/repositories/IUserRepository"

export class LoginUseCase {
  constructor(private readonly users: IUserRepository) {}

  async execute(email: string, password: string) {
    const result = await this.users.findWithHashByEmail(email)
    if (!result) throw new Error("Invalid credentials")

    const valid = await verify(result.passwordHash, password)
    if (!valid) throw new Error("Invalid credentials")

    return result.user
  }
}
