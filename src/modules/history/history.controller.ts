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
  create(@Body() createHistoryDto: CreateHistoryDto): HistoryTransfer {
    return this.historyService.create(createHistoryDto);
  }

  @Get()
  findAll(): HistoryTransfer[] {
    return this.historyService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): HistoryTransfer {
    return this.historyService.findById(id);
  }

  @Get("account/:accountId")
  findByAccountId(
    @Param("accountId", ParseIntPipe) accountId: number,
  ): HistoryTransfer[] {
    return this.historyService.findByAccountId(accountId);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateHistoryDto: UpdateHistoryDto,
  ): HistoryTransfer {
    return this.historyService.update(id, updateHistoryDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number): void {
    return this.historyService.delete(id);
  }
}
