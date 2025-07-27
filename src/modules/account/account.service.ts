import { Injectable, NotFoundException } from "@nestjs/common";
import { AccountRepository } from "./repositories/account.repository";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { Account } from "./entities/account.entity";

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  create(createAccountDto: CreateAccountDto): Account {
    return this.accountRepository.create(createAccountDto);
  }

  findAll(): Account[] {
    return this.accountRepository.findAll();
  }

  findById(id: number): Account {
    const account = this.accountRepository.findById(id);
    if (!account) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }
    return account;
  }

  update(id: number, updateAccountDto: UpdateAccountDto): Account {
    const account = this.accountRepository.update(id, updateAccountDto);
    if (!account) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }
    return account;
  }

  delete(id: number): void {
    const deleted = this.accountRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }
  }

  findByClientId(clientId: number): Account[] {
    return this.accountRepository.findByClientId(clientId);
  }
}
