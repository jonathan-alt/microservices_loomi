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
import { DepositDto } from "./dto/deposit.dto";
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

  // 1. Depósito em conta
  @Post(":id/deposit")
  async deposit(
    @Param("id", ParseIntPipe) id: number,
    @Body() depositDto: DepositDto,
  ): Promise<any> {
    return this.accountService.deposit(id, depositDto);
  }

  // 2. Consulta de saldo
  @Get(":id/balance")
  async getBalance(@Param("id", ParseIntPipe) id: number): Promise<any> {
    return this.accountService.getBalance(id);
  }
}
