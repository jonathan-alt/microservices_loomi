export class TransferCreatedEvent {
  constructor(
    public readonly transferId: number,
    public readonly accountId: number,
    public readonly targetAccountId: number,
    public readonly amount: number,
    public readonly description?: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class TransferCompletedEvent {
  constructor(
    public readonly transferId: number,
    public readonly accountId: number,
    public readonly targetAccountId: number,
    public readonly amount: number,
    public readonly newBalance: number,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class TransferFailedEvent {
  constructor(
    public readonly transferId: number,
    public readonly accountId: number,
    public readonly targetAccountId: number,
    public readonly amount: number,
    public readonly reason: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class AccountBalanceUpdatedEvent {
  constructor(
    public readonly accountId: number,
    public readonly clientId: number,
    public readonly oldBalance: number,
    public readonly newBalance: number,
    public readonly changeAmount: number,
    public readonly operationType: "TRANSFER" | "DEPOSIT" | "WITHDRAWAL",
    public readonly timestamp: Date = new Date(),
  ) {}
}
