import { Test, TestingModule } from "@nestjs/testing";
import { ClientService } from "./client.service";
import { UserRepository } from "./repositories/user.repository";
import { TransferClientService } from "./services/transfer-client.service";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { User as AuthUser } from "../auth/types/auth.types";
import { User } from "./entities/user.entity";

describe("ClientService", () => {
  let service: ClientService;
  let userRepository: UserRepository;
  let transferClientService: TransferClientService;

  const mockAuthUser: AuthUser = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    picture: "https://example.com/joao.jpg",
    phone: "(11) 99999-9999",
  };

  const mockUser: User = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    phone: "(11) 99999-9999",
    picture: "https://example.com/joao.jpg",
    address: "Rua das Flores, 123 - São Paulo, SP",
    agency: "0001",
    account_number: "123456-7",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockAccountDetails = {
    id: 1,
    agency: "0001",
    account_number: "123456-7",
    balance: 5000.0,
    client_id: 1,
  };

  const mockUserRepository = {
    findById: jest.fn(),
    findByCpf: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  };

  const mockTransferClientService = {
    getAccountDetails: jest.fn(),
    getAccountBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: TransferClientService, useValue: mockTransferClientService },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    userRepository = module.get<UserRepository>(UserRepository);
    transferClientService = module.get<TransferClientService>(
      TransferClientService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserDetails", () => {
    it("should return user details with banking information successfully", async () => {
      const userId = 1;
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTransferClientService.getAccountDetails.mockResolvedValue(
        mockAccountDetails,
      );

      const result = await service.getUserDetails(userId, mockAuthUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        cpf: mockUser.cpf,
        phone: mockUser.phone,
        picture: mockUser.picture,
        address: mockUser.address,
        bankingDetails: {
          agency: mockAccountDetails.agency,
          accountNumber: mockAccountDetails.account_number,
          balance: mockAccountDetails.balance,
          accountId: mockAccountDetails.id,
        },
      });
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(transferClientService.getAccountDetails).toHaveBeenCalledWith(
        userId,
      );
    });

    it("should return user details without banking information when account not found", async () => {
      const userId = 1;
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockTransferClientService.getAccountDetails.mockRejectedValue(
        new Error("Account not found"),
      );

      const result = await service.getUserDetails(userId, mockAuthUser);

      expect(result.success).toBe(true);
      expect(result.data.bankingDetails).toBeNull();
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it("should throw ForbiddenException when accessing other user data", async () => {
      const userId = 2; // Different user ID
      mockUserRepository.findById.mockResolvedValue(mockUser);

      await expect(
        service.getUserDetails(userId, mockAuthUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw NotFoundException when user not found", async () => {
      const userId = 1;
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.getUserDetails(userId, mockAuthUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const userId = 1;
      const updateUserDto = {
        name: "João Silva Atualizado",
        email: "joao.novo@email.com",
        address: "Nova Rua, 456",
        bankingDetails: {
          agency: "0002",
          accountNumber: "987654-3",
        },
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(
        userId,
        updateUserDto,
        mockAuthUser,
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe("Dados do usuário atualizados com sucesso");
      expect(result.data.name).toBe(updateUserDto.name);
      expect(result.data.email).toBe(updateUserDto.email);
      expect(result.data.address).toBe(updateUserDto.address);
      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        name: updateUserDto.name,
        email: updateUserDto.email,
        address: updateUserDto.address,
        agency: updateUserDto.bankingDetails.agency,
        account_number: updateUserDto.bankingDetails.accountNumber,
      });
    });

    it("should throw ForbiddenException when updating other user data", async () => {
      const userId = 2; // Different user ID
      const updateUserDto = { name: "João Silva Atualizado" };

      await expect(
        service.updateUser(userId, updateUserDto, mockAuthUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw NotFoundException when user not found", async () => {
      const userId = 1;
      const updateUserDto = { name: "João Silva Atualizado" };
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateUser(userId, updateUserDto, mockAuthUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("updateProfilePicture", () => {
    it("should update profile picture successfully", async () => {
      const userId = 1;
      const updateProfilePictureDto = {
        profilePicture: "https://example.com/new-avatar.jpg",
      };

      const updatedUser = {
        ...mockUser,
        picture: updateProfilePictureDto.profilePicture,
      };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfilePicture(
        userId,
        updateProfilePictureDto,
        mockAuthUser,
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe("Foto de perfil atualizada com sucesso");
      expect(result.data.picture).toBe(updateProfilePictureDto.profilePicture);
      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        picture: updateProfilePictureDto.profilePicture,
      });
    });

    it("should throw ForbiddenException when updating other user profile picture", async () => {
      const userId = 2; // Different user ID
      const updateProfilePictureDto = {
        profilePicture: "https://example.com/new-avatar.jpg",
      };

      await expect(
        service.updateProfilePicture(
          userId,
          updateProfilePictureDto,
          mockAuthUser,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw NotFoundException when user not found", async () => {
      const userId = 1;
      const updateProfilePictureDto = {
        profilePicture: "https://example.com/new-avatar.jpg",
      };
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateProfilePicture(
          userId,
          updateProfilePictureDto,
          mockAuthUser,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("searchByCpf", () => {
    it("should search user by CPF successfully with account details", async () => {
      const cpf = "123.456.789-00";
      mockUserRepository.findByCpf.mockResolvedValue(mockUser);
      mockTransferClientService.getAccountDetails.mockResolvedValue(
        mockAccountDetails,
      );

      const result = await service.searchByCpf(cpf, mockAuthUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        cpf: mockUser.cpf,
        phone: mockUser.phone,
        picture: mockUser.picture,
        account: {
          id: mockAccountDetails.id,
          agency: mockAccountDetails.agency,
          accountNumber: mockAccountDetails.account_number,
          balance: mockAccountDetails.balance,
        },
      });
      expect(userRepository.findByCpf).toHaveBeenCalledWith(cpf);
      expect(transferClientService.getAccountDetails).toHaveBeenCalledWith(
        mockUser.id,
      );
    });

    it("should search user by CPF successfully without account details", async () => {
      const cpf = "123.456.789-00";
      mockUserRepository.findByCpf.mockResolvedValue(mockUser);
      mockTransferClientService.getAccountDetails.mockRejectedValue(
        new Error("Account not found"),
      );

      const result = await service.searchByCpf(cpf, mockAuthUser);

      expect(result.success).toBe(true);
      expect(result.data.account).toBeNull();
      expect(userRepository.findByCpf).toHaveBeenCalledWith(cpf);
    });

    it("should throw ForbiddenException with invalid CPF", async () => {
      const cpf = "123"; // Invalid CPF

      await expect(service.searchByCpf(cpf, mockAuthUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("should throw NotFoundException when user not found", async () => {
      const cpf = "999.999.999-99";
      mockUserRepository.findByCpf.mockResolvedValue(null);

      await expect(service.searchByCpf(cpf, mockAuthUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
