import { Injectable, NotFoundException } from "@nestjs/common";
import { HistoryRepository } from "./repositories/history.repository";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { HistoryTransfer } from "./entities/history-transfer.entity";

@Injectable()
export class HistoryService {
  constructor(private readonly historyRepository: HistoryRepository) {}

  create(createHistoryDto: CreateHistoryDto): HistoryTransfer {
    return this.historyRepository.create(createHistoryDto);
  }

  findAll(): HistoryTransfer[] {
    return this.historyRepository.findAll();
  }

  findById(id: number): HistoryTransfer {
    const history = this.historyRepository.findById(id);
    if (!history) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
    return history;
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto): HistoryTransfer {
    const history = this.historyRepository.update(id, updateHistoryDto);
    if (!history) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
    return history;
  }

  delete(id: number): void {
    const deleted = this.historyRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
  }

  findByAccountId(accountId: number): HistoryTransfer[] {
    return this.historyRepository.findByAccountId(accountId);
  }
}
