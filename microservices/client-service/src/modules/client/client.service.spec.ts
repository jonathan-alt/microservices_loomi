import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { ClientRepository } from "./repositories/client.repository";
import { TransferClientService } from "./services";
import { ClientService } from "./";
import { Client } from "./entities/client.entity";
import { Client as AuthClient } from "../auth/types/auth.types";

describe("ClientService", () => {
  let service: ClientService;
  let clientRepository: ClientRepository;
  let transferClientService: TransferClientService;

  const mockAuthClient: AuthClient = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    picture: "https://example.com/joao.jpg",
    phone: "(11) 99999-9999",
  };

  const mockClient: Client = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    phone: "(11) 99999-9999",
    picture: "https://example.com/joao.jpg",

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

  const mockClientRepository = {
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
        { provide: ClientRepository, useValue: mockClientRepository },
        { provide: TransferClientService, useValue: mockTransferClientService },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    clientRepository = module.get<ClientRepository>(ClientRepository);
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
      mockClientRepository.findById.mockResolvedValue(mockClient);
      mockTransferClientService.getAccountDetails.mockResolvedValue(
        mockAccountDetails,
      );

      const result = await service.getUserDetails(userId, mockAuthClient);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: mockClient.id,
        name: mockClient.name,
        email: mockClient.email,
        cpf: mockClient.cpf,
        phone: mockClient.phone,
        picture: mockClient.picture,

        bankingDetails: {
          agency: mockAccountDetails.agency,
          accountNumber: mockAccountDetails.account_number,
          balance: mockAccountDetails.balance,
          accountId: mockAccountDetails.id,
        },
      });
      expect(clientRepository.findById).toHaveBeenCalledWith(userId);
      expect(transferClientService.getAccountDetails).toHaveBeenCalledWith(
        userId,
      );
    });

    it("should return user details without banking information when account not found", async () => {
      const userId = 1;
      mockClientRepository.findById.mockResolvedValue(mockClient);
      mockTransferClientService.getAccountDetails.mockRejectedValue(
        new Error("Account not found"),
      );

      const result = await service.getUserDetails(userId, mockAuthClient);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: mockClient.id,
        name: mockClient.name,
        email: mockClient.email,
        cpf: mockClient.cpf,
        phone: mockClient.phone,
        picture: mockClient.picture,
      });
      expect(clientRepository.findById).toHaveBeenCalledWith(userId);
    });

    it("should throw ForbiddenException when accessing other user data", async () => {
      const userId = 2; // Different user ID
      mockClientRepository.findById.mockResolvedValue(mockClient);

      await expect(
        service.getUserDetails(userId, mockAuthClient),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw NotFoundException when user not found", async () => {
      const userId = 1;
      mockClientRepository.findById.mockResolvedValue(null);

      await expect(
        service.getUserDetails(userId, mockAuthClient),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const userId = 1;
      const updateUserDto = {
        name: "João Silva Atualizado",
        email: "joao.novo@email.com",

        bankingDetails: {
          agency: "0002",
          accountNumber: "987654-3",
        },
      };

      const updatedClient = { ...mockClient, ...updateUserDto };
      mockClientRepository.findById.mockResolvedValue(mockClient);
      mockClientRepository.update.mockResolvedValue(updatedClient);

      const result = await service.updateUser(
        userId,
        updateUserDto,
        mockAuthClient,
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe("Dados do usuário atualizados com sucesso");
      expect(result.data.name).toBe(updateUserDto.name);
      expect(result.data.email).toBe(updateUserDto.email);

      expect(clientRepository.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
    });

    it("should throw ForbiddenException when updating other user data", async () => {
      const userId = 2; // Different user ID
      const updateUserDto = { name: "João Silva Atualizado" };

      await expect(
        service.updateUser(userId, updateUserDto, mockAuthClient),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe("updateProfilePicture", () => {
    it("should update profile picture successfully", async () => {
      const userId = 1;
      const updateProfilePictureDto = {
        profilePicture: "https://example.com/new-avatar.jpg",
      };

      const updatedClient = {
        ...mockClient,
        picture: updateProfilePictureDto.profilePicture,
      };
      mockClientRepository.findById.mockResolvedValue(mockClient);
      mockClientRepository.update.mockResolvedValue(updatedClient);

      const result = await service.updateProfilePicture(
        userId,
        updateProfilePictureDto,
        mockAuthClient,
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe("Foto de perfil atualizada com sucesso");
      expect(result.data.picture).toBe(updateProfilePictureDto.profilePicture);
      expect(clientRepository.update).toHaveBeenCalledWith(userId, {
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
          mockAuthClient,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe("searchByCpf", () => {
    it("should search user by CPF successfully with account details", async () => {
      const cpf = "123.456.789-00";
      mockClientRepository.findByCpf.mockResolvedValue(mockClient);
      mockTransferClientService.getAccountDetails.mockResolvedValue(
        mockAccountDetails,
      );

      const result = await service.searchByCpf(cpf, mockAuthClient);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: mockClient.id,
        name: mockClient.name,
        email: mockClient.email,
        cpf: mockClient.cpf,
        phone: mockClient.phone,
        picture: mockClient.picture,
        account: {
          id: mockAccountDetails.id,
          agency: mockAccountDetails.agency,
          accountNumber: mockAccountDetails.account_number,
          balance: mockAccountDetails.balance,
        },
      });
      expect(clientRepository.findByCpf).toHaveBeenCalledWith(cpf);
      expect(transferClientService.getAccountDetails).toHaveBeenCalledWith(
        mockClient.id,
      );
    });

    it("should search user by CPF successfully without account details", async () => {
      const cpf = "123.456.789-00";
      mockClientRepository.findByCpf.mockResolvedValue(mockClient);
      mockTransferClientService.getAccountDetails.mockRejectedValue(
        new Error("Account not found"),
      );

      const result = await service.searchByCpf(cpf, mockAuthClient);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: mockClient.id,
        name: mockClient.name,
        email: mockClient.email,
        cpf: mockClient.cpf,
        phone: mockClient.phone,
        picture: mockClient.picture,
      });
      expect(clientRepository.findByCpf).toHaveBeenCalledWith(cpf);
    });

    it("should throw ForbiddenException with invalid CPF", async () => {
      const cpf = "123"; // Invalid CPF

      await expect(service.searchByCpf(cpf, mockAuthClient)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("should throw NotFoundException when user not found", async () => {
      const cpf = "999.999.999-99";
      mockClientRepository.findByCpf.mockResolvedValue(null);

      await expect(service.searchByCpf(cpf, mockAuthClient)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
