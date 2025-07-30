import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { User as AuthUser } from "../auth/types/auth.types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfilePictureDto } from "./dto/update-profile-picture.dto";
import { UserRepository } from "./repositories/user.repository";
import { TransferClientService } from "./services/transfer-client.service";
import { User } from "./entities/user.entity";

@Injectable()
export class ClientService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transferClientService: TransferClientService,
  ) {}

  // 1. Detalhes do cliente
  async getUserDetails(userId: number, currentUser: AuthUser) {
    // Verificar se o usuário está acessando seus próprios dados
    if (currentUser.id !== userId) {
      throw new ForbiddenException("Acesso negado a dados de outro usuário");
    }

    // Buscar usuário no banco de dados
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    // Buscar dados bancários no transfer-service
    let bankingDetails = null;
    try {
      const accountDetails =
        await this.transferClientService.getAccountDetails(userId);
      bankingDetails = {
        agency: accountDetails.agency,
        accountNumber: accountDetails.account_number,
        balance: accountDetails.balance,
        accountId: accountDetails.id,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      // Se não encontrar conta, retorna dados sem informações bancárias
      console.warn(`Conta não encontrada para o usuário ${userId}`);
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phone,
        picture: user.picture,
        address: user.address,
        bankingDetails,
      },
    };
  }

  // 2. Atualização parcial de dados do cliente
  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
    currentUser: AuthUser,
  ) {
    // Verificar se o usuário está atualizando seus próprios dados
    if (currentUser.id !== userId) {
      throw new ForbiddenException("Acesso negado a dados de outro usuário");
    }

    // Buscar usuário no banco de dados
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException("Usuário não encontrado");
    }

    // Preparar dados para atualização
    const updateData: Partial<User> = {};

    if (updateUserDto.name) updateData.name = updateUserDto.name;
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.address) updateData.address = updateUserDto.address;
    if (updateUserDto.bankingDetails?.agency)
      updateData.agency = updateUserDto.bankingDetails.agency;
    if (updateUserDto.bankingDetails?.accountNumber)
      updateData.account_number = updateUserDto.bankingDetails.accountNumber;

    // Atualizar usuário no banco
    const updatedUser = await this.userRepository.update(userId, updateData);

    return {
      success: true,
      message: "Dados do usuário atualizados com sucesso",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        cpf: updatedUser.cpf,
        phone: updatedUser.phone,
        picture: updatedUser.picture,
        address: updatedUser.address,
        bankingDetails: {
          agency: updatedUser.agency,
          accountNumber: updatedUser.account_number,
        },
      },
    };
  }

  // 3. Atualização da foto de perfil
  async updateProfilePicture(
    userId: number,
    updateProfilePictureDto: UpdateProfilePictureDto,
    currentUser: AuthUser,
  ) {
    // Verificar se o usuário está atualizando seus próprios dados
    if (currentUser.id !== userId) {
      throw new ForbiddenException("Acesso negado a dados de outro usuário");
    }

    // Buscar usuário no banco de dados
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException("Usuário não encontrado");
    }

    // Atualizar foto de perfil
    const updatedUser = await this.userRepository.update(userId, {
      picture: updateProfilePictureDto.profilePicture,
    });

    return {
      success: true,
      message: "Foto de perfil atualizada com sucesso",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        cpf: updatedUser.cpf,
        phone: updatedUser.phone,
        picture: updatedUser.picture,
        address: updatedUser.address,
      },
    };
  }

  // Busca de cliente por CPF
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async searchByCpf(cpf: string, _currentUser: AuthUser) {
    // Validar CPF
    if (!cpf || cpf.length < 11) {
      throw new ForbiddenException("CPF inválido");
    }

    // Buscar usuário por CPF no banco de dados
    const user = await this.userRepository.findByCpf(cpf);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    // Buscar dados bancários no transfer-service
    let accountDetails = null;
    try {
      accountDetails = await this.transferClientService.getAccountDetails(
        user.id,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      console.warn(`Conta não encontrada para o usuário ${user.id}`);
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phone,
        picture: user.picture,
        account: accountDetails
          ? {
              id: accountDetails.id,
              agency: accountDetails.agency,
              accountNumber: accountDetails.account_number,
              balance: accountDetails.balance,
            }
          : null,
      },
    };
  }
}
