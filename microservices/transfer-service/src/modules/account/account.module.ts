import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { AccountRepository } from "./repositories/account.repository";
import { Account } from "./entities/account.entity";
import { MessagingModule } from "../messaging/messaging.module";
import { HistoryTransferModule } from "../history_transfer/history_transfer.module";
import { RetryService } from "../../common/services/retry.service";
import { NotificationsModule } from "../notifications/notifications.module";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    MessagingModule,
    HistoryTransferModule,
    NotificationsModule,
    AuditModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, RetryService],
  exports: [AccountService],
})
export class AccountModule {}
