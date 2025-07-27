import { Injectable } from "@nestjs/common";
import { HistoryTransfer } from "../entities/history-transfer.entity";
import { CreateHistoryDto } from "../dto/create-history.dto";
import { UpdateHistoryDto } from "../dto/update-history.dto";

@Injectable()
export class HistoryRepository {
  private histories: HistoryTransfer[] = [
    {
      id: 1,
      account_id: 1,
      transfer_value: 100.0,
      target_id_account: 2,
      timestamp: new Date(),
      description: "Transferência inicial",
      new_value: 900.0,
      old_value: 1000.0,
      type: "TRANSFER-SENT",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      account_id: 2,
      transfer_value: 100.0,
      target_id_account: 1,
      timestamp: new Date(),
      description: "Recebimento de transferência",
      new_value: 600.0,
      old_value: 500.0,
      type: "TRANSFER-RECEIVED",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  create(createHistoryDto: CreateHistoryDto): HistoryTransfer {
    const history: HistoryTransfer = {
      id: this.histories.length + 1,
      ...createHistoryDto,
      timestamp: new Date(createHistoryDto.timestamp),
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.histories.push(history);
    return history;
  }

  findAll(): HistoryTransfer[] {
    return this.histories;
  }

  findById(id: number): HistoryTransfer | null {
    return this.histories.find((history) => history.id === id) || null;
  }

  update(
    id: number,
    updateHistoryDto: UpdateHistoryDto,
  ): HistoryTransfer | null {
    const index = this.histories.findIndex((history) => history.id === id);
    if (index === -1) return null;

    this.histories[index] = {
      ...this.histories[index],
      ...updateHistoryDto,
      timestamp: updateHistoryDto.timestamp
        ? new Date(updateHistoryDto.timestamp)
        : this.histories[index].timestamp,
      updated_at: new Date(),
    };
    return this.histories[index];
  }

  delete(id: number): boolean {
    const index = this.histories.findIndex((history) => history.id === id);
    if (index === -1) return false;

    this.histories.splice(index, 1);
    return true;
  }

  findByAccountId(accountId: number): HistoryTransfer[] {
    return this.histories.filter((history) => history.account_id === accountId);
  }
}
