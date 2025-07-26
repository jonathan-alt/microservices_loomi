import { Injectable, Logger } from "@nestjs/common";
import { TransferRepository } from "./repositories/transfer.repository";

@Injectable()
export class TransferService {
  private readonly logger = new Logger(TransferService.name);

  constructor(private readonly transferRepository: TransferRepository) {}

  getHello(): string {
    return "Transfer Service is running!";
  }
}
