export interface AuditEvent {
  id: string;
  userId: number;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditServiceInterface {
  logEvent(event: Omit<AuditEvent, "id" | "timestamp">): Promise<void>;
  getAuditTrail(userId: number, limit?: number): Promise<AuditEvent[]>;
  getAuditTrailByAction(action: string, limit?: number): Promise<AuditEvent[]>;
}
