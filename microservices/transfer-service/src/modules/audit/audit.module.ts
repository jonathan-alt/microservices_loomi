import { Module } from "@nestjs/common";
import { AuditClientService } from "./audit-client.service";

@Module({
  providers: [AuditClientService],
  exports: [AuditClientService],
})
export class AuditModule {}
