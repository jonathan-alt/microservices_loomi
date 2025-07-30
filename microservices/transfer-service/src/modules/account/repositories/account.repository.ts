import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Account } from "../entities/account.entity";
import { CreateAccountDto } from "../dto/create-account.dto";
import { UpdateAccountDto } from "../dto/update-account.dto";

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create(createAccountDto);
    return this.accountRepository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async findById(id: number): Promise<Account | null> {
    return this.accountRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account | null> {
    await this.accountRepository.update(id, updateAccountDto);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.accountRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findByClientId(clientId: number): Promise<Account | null> {
    return this.accountRepository.findOne({ where: { client_id: clientId } });
  }
}
