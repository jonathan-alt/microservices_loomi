import { Injectable } from "@nestjs/common";
import { Account } from "../entities/account.entity";
import { CreateAccountDto } from "../dto/create-account.dto";
import { UpdateAccountDto } from "../dto/update-account.dto";

@Injectable()
export class AccountRepository {
  private accounts: Account[] = [
    {
      id: 1,
      client_id: 1,
      value: 1000.0,
      history_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      client_id: 2,
      value: 500.0,
      history_id: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  create(createAccountDto: CreateAccountDto): Account {
    const account: Account = {
      id: this.accounts.length + 1,
      ...createAccountDto,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.accounts.push(account);
    return account;
  }

  findAll(): Account[] {
    return this.accounts;
  }

  findById(id: number): Account | null {
    return this.accounts.find((account) => account.id === id) || null;
  }

  update(id: number, updateAccountDto: UpdateAccountDto): Account | null {
    const index = this.accounts.findIndex((account) => account.id === id);
    if (index === -1) return null;

    this.accounts[index] = {
      ...this.accounts[index],
      ...updateAccountDto,
      updated_at: new Date(),
    };
    return this.accounts[index];
  }

  delete(id: number): boolean {
    const index = this.accounts.findIndex((account) => account.id === id);
    if (index === -1) return false;

    this.accounts.splice(index, 1);
    return true;
  }

  findByClientId(clientId: number): Account[] {
    return this.accounts.filter((account) => account.client_id === clientId);
  }
}
