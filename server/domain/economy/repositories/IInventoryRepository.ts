export type IInventoryRepository = {
  getQuantity(userId: number, item: string): Promise<number>
  getAll(userId: number): Promise<Record<string, number>>
  add(userId: number, item: string, amount: number): Promise<number>
  spend(userId: number, item: string, amount: number): Promise<number>
}
