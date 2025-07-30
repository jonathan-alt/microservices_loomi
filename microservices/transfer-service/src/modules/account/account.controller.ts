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
import { AccountService } from "./account.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Account } from "./entities/account.entity";

@Controller("accounts")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  async findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Account> {
    return this.accountService.findById(id);
  }

  @Get("client/:clientId")
  async findByClientId(
    @Param("clientId", ParseIntPipe) clientId: number,
  ): Promise<Account | null> {
    return this.accountService.findByClientId(clientId);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.accountService.delete(id);
  }

  @Post("transfer")
  async transfer(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Account> {
    return this.accountService.transfer(createTransactionDto);
  }
}
