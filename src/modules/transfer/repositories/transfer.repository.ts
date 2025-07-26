import { Injectable } from "@nestjs/common";
import { Transfer } from "../entities/transfer.entity";

@Injectable()
export class TransferRepository {
  private transfers: Transfer[] = [];
}
