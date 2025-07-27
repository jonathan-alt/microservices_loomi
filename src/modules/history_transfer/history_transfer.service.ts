import { Injectable, NotFoundException } from "@nestjs/common";
import { HistoryTransferRepository } from "./repositories/history_transfer.repository";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { HistoryTransfer } from "./entities/history-transfer.entity";

@Injectable()
export class HistoryTransferService {
  constructor(
    private readonly historyTransferRepository: HistoryTransferRepository,
  ) {}

  async create(createHistoryDto: CreateHistoryDto): Promise<HistoryTransfer> {
    return this.historyTransferRepository.create(createHistoryDto);
  }

  async findAll(): Promise<HistoryTransfer[]> {
    return this.historyTransferRepository.findAll();
  }

  async findById(id: number): Promise<HistoryTransfer> {
    const history = await this.historyTransferRepository.findById(id);
    if (!history) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
    return history;
  }

  async update(
    id: number,
    updateHistoryDto: UpdateHistoryDto,
  ): Promise<HistoryTransfer> {
    const history = await this.historyTransferRepository.update(
      id,
      updateHistoryDto,
    );
    if (!history) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
    return history;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.historyTransferRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado`);
    }
  }

  async findByAccountId(accountId: number): Promise<HistoryTransfer[]> {
    return this.historyTransferRepository.findByAccountId(accountId);
  }
}
