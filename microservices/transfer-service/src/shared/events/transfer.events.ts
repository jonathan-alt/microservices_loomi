// Eventos de transferência
export const TRANSFER_EVENTS = {
  CREATED: "transfer.created",
  COMPLETED: "transfer.completed",
  FAILED: "transfer.failed",
  CANCELLED: "transfer.cancelled",
  PROCESSING: "transfer.processing",
} as const;

export type TransferEventType =
  (typeof TRANSFER_EVENTS)[keyof typeof TRANSFER_EVENTS];

// Classes de eventos
export class TransferCreatedEvent {
  constructor(
    public readonly transferId: number,
    public readonly fromAccountId: number,
    public readonly toAccountId: number,
    public readonly amount: number,
    public readonly description?: string,
  ) {}
}

export class TransferCompletedEvent {
  constructor(
    public readonly transferId: number,
    public readonly fromAccountId: number,
    public readonly toAccountId: number,
    public readonly amount: number,
    public readonly completedAt: Date,
  ) {}
}

export class TransferFailedEvent {
  constructor(
    public readonly transferId: number,
    public readonly fromAccountId: number,
    public readonly toAccountId: number,
    public readonly amount: number,
    public readonly reason: string,
    public readonly failedAt: Date,
  ) {}
}

export class AccountBalanceUpdatedEvent {
  constructor(
    public readonly accountId: number,
    public readonly clientId: number,
    public readonly oldBalance: number,
    public readonly newBalance: number,
    public readonly changeAmount: number,
    public readonly operationType: string,
  ) {}
}
