import { Injectable, NotFoundException } from "@nestjs/common";
import { AccountRepository } from "./repositories/account.repository";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { Account } from "./entities/account.entity";

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountRepository.create(createAccountDto);
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepository.findAll();
  }

  async findById(id: number): Promise<Account> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }
    return account;
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.accountRepository.update(id, updateAccountDto);
    if (!account) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }
    return account;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.accountRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Conta com ID ${id} não encontrada`);
    }
  }

  async findByClientId(clientId: number): Promise<Account[]> {
    return this.accountRepository.findByClientId(clientId);
  }
}
