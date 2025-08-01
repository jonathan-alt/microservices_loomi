import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HistoryTransferService } from "./history_transfer.service";
import { HistoryTransferController } from "./history_transfer.controller";
import { HistoryTransferRepository } from "./repositories/history_transfer.repository";
import { HistoryTransfer } from "./entities/history-transfer.entity";
import { MessagingModule } from "../messaging/messaging.module";

@Module({
  imports: [TypeOrmModule.forFeature([HistoryTransfer]), MessagingModule],
  controllers: [HistoryTransferController],
  providers: [HistoryTransferService, HistoryTransferRepository],
  exports: [HistoryTransferService],
})
export class HistoryTransferModule {}
