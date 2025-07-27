import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { HistoryTransferService } from "./history_transfer.service";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { HistoryTransfer } from "./entities/history-transfer.entity";

@Controller("history_transfer")
export class HistoryTransferController {
  constructor(
    private readonly historyTransferService: HistoryTransferService,
  ) {}

  @Post()
  async create(
    @Body() createHistoryDto: CreateHistoryDto,
  ): Promise<HistoryTransfer> {
    return this.historyTransferService.create(createHistoryDto);
  }

  @Get()
  async findAll(): Promise<HistoryTransfer[]> {
    return this.historyTransferService.findAll();
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<HistoryTransfer> {
    return this.historyTransferService.findById(id);
  }

  @Get("account/:accountId")
  async findByAccountId(
    @Param("accountId", ParseIntPipe) accountId: number,
  ): Promise<HistoryTransfer[]> {
    return this.historyTransferService.findByAccountId(accountId);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateHistoryDto: UpdateHistoryDto,
  ): Promise<HistoryTransfer> {
    return this.historyTransferService.update(id, updateHistoryDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.historyTransferService.delete(id);
  }
}
