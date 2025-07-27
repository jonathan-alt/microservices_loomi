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
import { HistoryService } from "./history.service";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { HistoryTransfer } from "./entities/history-transfer.entity";

@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  async create(
    @Body() createHistoryDto: CreateHistoryDto,
  ): Promise<HistoryTransfer> {
    return this.historyService.create(createHistoryDto);
  }

  @Get()
  async findAll(): Promise<HistoryTransfer[]> {
    return this.historyService.findAll();
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<HistoryTransfer> {
    return this.historyService.findById(id);
  }

  @Get("account/:accountId")
  async findByAccountId(
    @Param("accountId", ParseIntPipe) accountId: number,
  ): Promise<HistoryTransfer[]> {
    return this.historyService.findByAccountId(accountId);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateHistoryDto: UpdateHistoryDto,
  ): Promise<HistoryTransfer> {
    return this.historyService.update(id, updateHistoryDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.historyService.delete(id);
  }
}
