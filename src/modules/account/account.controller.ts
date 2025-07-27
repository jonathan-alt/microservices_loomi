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
import { Account } from "./entities/account.entity";

@Controller("accounts")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Account {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  findAll(): Account[] {
    return this.accountService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Account {
    return this.accountService.findById(id);
  }

  @Get("client/:clientId")
  findByClientId(@Param("clientId", ParseIntPipe) clientId: number): Account[] {
    return this.accountService.findByClientId(clientId);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Account {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number): void {
    return this.accountService.delete(id);
  }
}
