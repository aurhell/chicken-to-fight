export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public readonly gold: number,
    public readonly createdAt: Date,
  ) {}
}
