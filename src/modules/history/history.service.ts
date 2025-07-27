import { Injectable, NotFoundException } from "@nestjs/common";
import { HistoryRepository } from "./repositories/history.repository";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { HistoryTransfer } from "./entities/history-transfer.entity";

@Injectable()
export class HistoryService {
  constructor(private readonly historyRepository: HistoryRepository) {}

  async create(createHistoryDto: CreateHistoryDto): Promise<HistoryTransfer> {
    return this.historyRepository.create(createHistoryDto);
  }

  async findAll(): Promise<HistoryTransfer[]> {
    return this.historyRepository.findAll();
  }

  async findById(id: number): Promise<HistoryTransfer> {
    const history = await this.historyRepository.findById(id);
    if (!history) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
    return history;
  }

  async update(
    id: number,
    updateHistoryDto: UpdateHistoryDto,
  ): Promise<HistoryTransfer> {
    const history = await this.historyRepository.update(id, updateHistoryDto);
    if (!history) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
    return history;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.historyRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
  }

  async findByAccountId(accountId: number): Promise<HistoryTransfer[]> {
    return this.historyRepository.findByAccountId(accountId);
  }
}
