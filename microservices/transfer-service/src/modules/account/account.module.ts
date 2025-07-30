import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { AccountRepository } from "./repositories/account.repository";
import { Account } from "./entities/account.entity";
import { MessagingModule } from "../messaging/messaging.module";
import { HistoryTransferModule } from "../history_transfer/history_transfer.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    MessagingModule,
    HistoryTransferModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
