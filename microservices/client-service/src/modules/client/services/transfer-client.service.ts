import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export interface AccountDetails {
  id: number;
  agency: string;
  account_number: string;
  balance: number;
  client_id: number;
}

@Injectable()
export class TransferClientService {
  constructor(private readonly httpService: HttpService) {}

  private getTransferServiceUrl(): string {
    return process.env.TRANSFER_SERVICE_URL || "http://transfer-service:3001";
  }

  async getAccountDetails(userId: number): Promise<AccountDetails> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<AccountDetails>(
          `${this.getTransferServiceUrl()}/api/accounts/client/${userId}`,
        ),
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException("Conta não encontrada", HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        "Erro ao buscar dados da conta",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAccountBalance(accountId: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.getTransferServiceUrl()}/api/accounts/${accountId}/balance`,
        ),
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException("Conta não encontrada", HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        "Erro ao buscar saldo da conta",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
