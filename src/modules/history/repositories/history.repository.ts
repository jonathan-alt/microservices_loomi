import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HistoryTransfer } from "../entities/history-transfer.entity";
import { CreateHistoryDto } from "../dto/create-history.dto";
import { UpdateHistoryDto } from "../dto/update-history.dto";

@Injectable()
export class HistoryRepository {
  constructor(
    @InjectRepository(HistoryTransfer)
    private readonly historyRepository: Repository<HistoryTransfer>,
  ) {}

  async create(createHistoryDto: CreateHistoryDto): Promise<HistoryTransfer> {
    const history = this.historyRepository.create({
      ...createHistoryDto,
      timestamp: new Date(createHistoryDto.timestamp),
    });
    return this.historyRepository.save(history);
  }

  async findAll(): Promise<HistoryTransfer[]> {
    return this.historyRepository.find();
  }

  async findById(id: number): Promise<HistoryTransfer | null> {
    return this.historyRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateHistoryDto: UpdateHistoryDto,
  ): Promise<HistoryTransfer | null> {
    const updateData = {
      ...updateHistoryDto,
      timestamp: updateHistoryDto.timestamp
        ? new Date(updateHistoryDto.timestamp)
        : undefined,
    };
    await this.historyRepository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.historyRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findByAccountId(accountId: number): Promise<HistoryTransfer[]> {
    return this.historyRepository.find({ where: { account_id: accountId } });
  }
}
