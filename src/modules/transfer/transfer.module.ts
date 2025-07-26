import { Module } from "@nestjs/common";
import { TransferController } from "./transfer.controller";
import { TransferService } from "./transfer.service";
import { TransferRepository } from "./repositories/transfer.repository";

@Module({
  controllers: [TransferController],
  providers: [TransferService, TransferRepository],
  exports: [TransferService],
})
export class TransferModule {}
