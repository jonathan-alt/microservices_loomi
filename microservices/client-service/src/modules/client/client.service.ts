import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { ClientRepository } from "./repositories/client.repository";
import { TransferClientService } from "./services/transfer-client.service";
import { Client as AuthClient } from "../auth/types/auth.types";

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly transferClientService: TransferClientService,
  ) {}

  async getUserDetails(userId: number, authClient: AuthClient) {
    if (userId !== authClient.id) {
      throw new ForbiddenException("Acesso negado a dados de outro usuário");
    }

    const client = await this.clientRepository.findById(userId);
    if (!client) {
      throw new NotFoundException("Usuário não encontrado");
    }

    try {
      const accountDetails =
        await this.transferClientService.getAccountDetails(userId);
      return {
        success: true,
        data: {
          id: client.id,
          name: client.name,
          email: client.email,
          cpf: client.cpf,
          phone: client.phone,
          picture: client.picture,
          bankingDetails: {
            agency: accountDetails.agency,
            accountNumber: accountDetails.account_number,
            balance: accountDetails.balance,
            accountId: accountDetails.id,
          },
        },
      };
    } catch {
      // Se não conseguir buscar dados bancários, retorna apenas dados do usuário
      return {
        success: true,
        data: {
          id: client.id,
          name: client.name,
          email: client.email,
          cpf: client.cpf,
          phone: client.phone,
          picture: client.picture,
        },
      };
    }
  }

  async updateUser(userId: number, updateData: any, authClient: AuthClient) {
    if (userId !== authClient.id) {
      throw new ForbiddenException("Acesso negado a dados de outro usuário");
    }

    const updatedClient = await this.clientRepository.update(
      userId,
      updateData,
    );

    return {
      success: true,
      message: "Dados do usuário atualizados com sucesso",
      data: {
        id: updatedClient.id,
        name: updatedClient.name,
        email: updatedClient.email,
        cpf: updatedClient.cpf,
        phone: updatedClient.phone,
        picture: updatedClient.picture,
        bankingDetails: {
          agency: updatedClient.agency,
          accountNumber: updatedClient.account_number,
        },
      },
    };
  }

  async updateProfilePicture(
    userId: number,
    updateData: any,
    authClient: AuthClient,
  ) {
    if (userId !== authClient.id) {
      throw new ForbiddenException("Acesso negado a dados de outro usuário");
    }

    const updatedClient = await this.clientRepository.update(userId, {
      picture: updateData.profilePicture,
    });

    return {
      success: true,
      message: "Foto de perfil atualizada com sucesso",
      data: {
        id: updatedClient.id,
        name: updatedClient.name,
        email: updatedClient.email,
        cpf: updatedClient.cpf,
        phone: updatedClient.phone,
        picture: updatedClient.picture,
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async searchByCpf(cpf: string, authClient: AuthClient) {
    // Validar formato do CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      throw new ForbiddenException("CPF inválido");
    }

    const client = await this.clientRepository.findByCpf(cpf);
    if (!client) {
      throw new NotFoundException("Usuário não encontrado");
    }

    try {
      const accountDetails = await this.transferClientService.getAccountDetails(
        client.id,
      );
      return {
        success: true,
        data: {
          id: client.id,
          name: client.name,
          email: client.email,
          cpf: client.cpf,
          phone: client.phone,
          picture: client.picture,
          account: {
            id: accountDetails.id,
            agency: accountDetails.agency,
            accountNumber: accountDetails.account_number,
            balance: accountDetails.balance,
          },
        },
      };
    } catch {
      // Se não conseguir buscar dados bancários, retorna apenas dados do usuário
      return {
        success: true,
        data: {
          id: client.id,
          name: client.name,
          email: client.email,
          cpf: client.cpf,
          phone: client.phone,
          picture: client.picture,
        },
      };
    }
  }
}
