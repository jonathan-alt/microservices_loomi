import { Injectable, HttpException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export interface AccountDetails {
  id: number;
  agency: string;
  account_number: string;
  balance: number;
  client_id: number;
}

export interface AccountBalance {
  accountId: number;
  balance: number;
  currency: string;
  lastUpdate: string;
}

@Injectable()
export class TransferClientService {
  constructor(private readonly httpService: HttpService) {}

  private getTransferServiceUrl(): string {
    return process.env.TRANSFER_SERVICE_URL || "http://transfer-service:3001";
  }

  async getAccountDetails(userId: number): Promise<AccountDetails> {
    try {
      const url = `${this.getTransferServiceUrl()}/api/accounts/client/${userId}`;
      const response = await firstValueFrom(this.httpService.get<AccountDetails>(url));
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException("Conta não encontrada", 404);
      }
      throw new HttpException("Erro ao buscar dados da conta", 500);
    }
  }

  async getAccountBalance(accountId: number): Promise<AccountBalance> {
    try {
      const url = `${this.getTransferServiceUrl()}/api/accounts/${accountId}/balance`;
      const response = await firstValueFrom(this.httpService.get<AccountBalance>(url));
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException("Conta não encontrada", 404);
      }
      throw new HttpException("Erro ao buscar saldo da conta", 500);
    }
  }
}
