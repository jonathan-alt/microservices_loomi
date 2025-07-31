import { Injectable, Logger } from "@nestjs/common";
import { AuditServiceInterface, AuditEvent } from "./audit-service.interface";

@Injectable()
export class AuditClientService implements AuditServiceInterface {
  private readonly logger = new Logger(AuditClientService.name);

  async logEvent(event: Omit<AuditEvent, "id" | "timestamp">): Promise<void> {
    try {
      this.logger.log(
        `Logging audit event: ${event.action} on ${event.resource}`,
      );

      const auditEvent: AuditEvent = {
        id: `audit-${Date.now()}`,
        ...event,
        timestamp: new Date().toISOString(),
      };

      await this.simulateAuditStorage(auditEvent);

      this.logger.log(`Audit event logged: ${auditEvent.id}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to log audit event: ${(error as Error).message}`,
      );
    }
  }

  async getAuditTrail(
    userId: number,
    limit: number = 50,
  ): Promise<AuditEvent[]> {
    try {
      this.logger.log(`Getting audit trail for user ${userId}`);

      const events: AuditEvent[] = [
        {
          id: "audit-1",
          userId,
          action: "TRANSFER_CREATED",
          resource: "transfer",
          resourceId: "transfer-123",
          details: { amount: 1000, receiverId: 2 },
          timestamp: new Date().toISOString(),
        },
        {
          id: "audit-2",
          userId,
          action: "TRANSFER_COMPLETED",
          resource: "transfer",
          resourceId: "transfer-123",
          details: { status: "SUCCESS" },
          timestamp: new Date().toISOString(),
        },
      ];

      // Simular delay de busca
      await new Promise((resolve) => setTimeout(resolve, 20));

      return events.slice(0, limit);
    } catch (error: any) {
      this.logger.error(
        `Failed to get audit trail: ${(error as Error).message}`,
      );
      return [];
    }
  }

  async getAuditTrailByAction(
    action: string,
    limit: number = 50,
  ): Promise<AuditEvent[]> {
    try {
      this.logger.log(`Getting audit trail for action: ${action}`);

      // Simular busca por ação
      const events: AuditEvent[] = [
        {
          id: "audit-3",
          userId: 1,
          action,
          resource: "transfer",
          resourceId: "transfer-456",
          details: { action, timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString(),
        },
      ];

      // Simular delay de busca
      await new Promise((resolve) => setTimeout(resolve, 15));

      return events.slice(0, limit);
    } catch (error: any) {
      this.logger.error(
        `Failed to get audit trail by action: ${(error as Error).message}`,
      );
      return [];
    }
  }

  private async simulateAuditStorage(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: AuditEvent,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    if (Math.random() < 0.02) {
      throw new Error("Audit service temporarily unavailable");
    }
  }
}
