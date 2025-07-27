import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import {
  TransferCreatedEvent,
  TransferCompletedEvent,
  TransferFailedEvent,
  AccountBalanceUpdatedEvent,
} from "../../shared/events/transfer.events";

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private client: unknown;

  onModuleInit(): void {
    console.log("MessagingService initialized");
  }

  onModuleDestroy(): void {
    if (this.client) {
      console.log("MessagingService destroyed");
    }
  }

  // Métodos para publicar eventos de transferência
  publishTransferCreated(event: TransferCreatedEvent): void {
    console.log("Publishing transfer created event:", event);
  }

  publishTransferCompleted(event: TransferCompletedEvent): void {
    console.log("Publishing transfer completed event:", event);
  }

  publishTransferFailed(event: TransferFailedEvent): void {
    console.log("Publishing transfer failed event:", event);
  }

  publishAccountBalanceUpdated(event: AccountBalanceUpdatedEvent): void {
    console.log("Publishing account balance updated event:", event);
  }

  sendMessage(pattern: string, data: unknown): Promise<unknown> {
    console.log("Sending message:", { pattern, data });

    return Promise.resolve();
  }
}
