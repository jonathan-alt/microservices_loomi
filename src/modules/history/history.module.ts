import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HistoryService } from "./history.service";
import { HistoryController } from "./history.controller";
import { HistoryRepository } from "./repositories/history.repository";
import { HistoryTransfer } from "./entities/history-transfer.entity";

@Module({
  imports: [TypeOrmModule.forFeature([HistoryTransfer])],
  controllers: [HistoryController],
  providers: [HistoryService, HistoryRepository],
  exports: [HistoryService],
})
export class HistoryModule {}
