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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { AccountService } from "./account.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { DepositDto } from "./dto/deposit.dto";
import { Account } from "./entities/account.entity";

@ApiTags("accounts")
@Controller("accounts")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: "Criar uma nova conta" })
  @ApiResponse({
    status: 201,
    description: "Conta criada com sucesso",
    type: Account,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos ou conta já existe",
  })
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todas as contas" })
  @ApiResponse({
    status: 200,
    description: "Lista de contas retornada com sucesso",
    type: [Account],
  })
  async findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar conta por ID" })
  @ApiParam({ name: "id", description: "ID da conta", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Conta encontrada",
    type: Account,
  })
  @ApiResponse({
    status: 404,
    description: "Conta não encontrada",
  })
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
  @ApiOperation({ summary: "Realizar transferência entre contas" })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 200,
    description: "Transferência realizada com sucesso",
    type: Account,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos ou saldo insuficiente",
  })
  @ApiResponse({
    status: 404,
    description: "Conta não encontrada",
  })
  async transfer(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Account> {
    return this.accountService.transfer(createTransactionDto);
  }

  // 1. Depósito em conta
  @Post(":id/deposit")
  @ApiOperation({ summary: "Realizar depósito em conta" })
  @ApiParam({ name: "id", description: "ID da conta", example: 1 })
  @ApiBody({ type: DepositDto })
  @ApiResponse({
    status: 200,
    description: "Depósito realizado com sucesso",
  })
  @ApiResponse({
    status: 400,
    description: "Valor inválido",
  })
  @ApiResponse({
    status: 404,
    description: "Conta não encontrada",
  })
  async deposit(
    @Param("id", ParseIntPipe) id: number,
    @Body() depositDto: DepositDto,
  ): Promise<any> {
    return this.accountService.deposit(id, depositDto);
  }

  // 2. Consulta de saldo
  @Get(":id/balance")
  @ApiOperation({ summary: "Consultar saldo da conta" })
  @ApiParam({ name: "id", description: "ID da conta", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Saldo retornado com sucesso",
  })
  @ApiResponse({
    status: 404,
    description: "Conta não encontrada",
  })
  async getBalance(@Param("id", ParseIntPipe) id: number): Promise<any> {
    return this.accountService.getBalance(id);
  }
}
