import { Test, TestingModule } from "@nestjs/testing";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { ClientRepository } from "./repositories/client.repository";
import { TransferClientService } from "./services/transfer-client.service";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Client as AuthClient } from "../auth/types/auth.types";

describe("ClientController", () => {
  let controller: ClientController;
  let clientService: ClientService;
  let clientRepository: ClientRepository;
  let transferClientService: TransferClientService;

  const mockClient: AuthClient = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    picture: "https://example.com/joao.jpg",
    phone: "(11) 99999-9999",
  };

  const mockClientRepository = {
    findById: jest.fn(),
    findByCpf: jest.fn(),
    update: jest.fn(),
  };

  const mockTransferClientService = {
    getAccountDetails: jest.fn(),
    getAccountBalance: jest.fn(),
  };

  const mockClientService = {
    getUserDetails: jest.fn(),
    updateUser: jest.fn(),
    updateProfilePicture: jest.fn(),
    searchByCpf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        { provide: ClientService, useValue: mockClientService },
        { provide: ClientRepository, useValue: mockClientRepository },
        { provide: TransferClientService, useValue: mockTransferClientService },
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
    clientRepository = module.get<ClientRepository>(ClientRepository);
    transferClientService = module.get<TransferClientService>(
      TransferClientService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserDetails", () => {
    it("should return user details successfully", async () => {
      const userId = "1";
      const expectedResponse = {
        success: true,
        data: {
          id: 1,
          name: "João Silva",
          email: "joao@email.com",
          cpf: "123.456.789-00",
          phone: "(11) 99999-9999",
          picture: "https://example.com/joao.jpg",
          bankingDetails: {
            agency: "0001",
            accountNumber: "123456-7",
            balance: 5000.0,
            accountId: 1,
          },
        },
      };

      mockClientService.getUserDetails.mockResolvedValue(expectedResponse);

      const result = await controller.getUserDetails(userId, {
        user: mockClient,
      });

      expect(result).toEqual(expectedResponse);
      expect(clientService.getUserDetails).toHaveBeenCalledWith(1, mockClient);
    });

    it("should throw ForbiddenException when accessing other user data", async () => {
      const userId = "2"; // Different user ID
      mockClientService.getUserDetails.mockRejectedValue(
        new ForbiddenException("Acesso negado a dados de outro usuário"),
      );

      await expect(
        controller.getUserDetails(userId, { user: mockClient }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const userId = "1";
      const updateUserDto = {
        name: "João Silva Atualizado",
        email: "joao.novo@email.com",
        bankingDetails: {
          agency: "0002",
          accountNumber: "987654-3",
        },
      };

      const expectedResponse = {
        success: true,
        message: "Dados do usuário atualizados com sucesso",
        data: {
          id: 1,
          name: "João Silva Atualizado",
          email: "joao.novo@email.com",
          cpf: "123.456.789-00",
          phone: "(11) 99999-9999",
          picture: "https://example.com/joao.jpg",

          bankingDetails: {
            agency: "0002",
            accountNumber: "987654-3",
          },
        },
      };

      mockClientService.updateUser.mockResolvedValue(expectedResponse);

      const result = await controller.updateUser(userId, updateUserDto, {
        user: mockClient,
      });

      expect(result).toEqual(expectedResponse);
      expect(clientService.updateUser).toHaveBeenCalledWith(
        1,
        updateUserDto,
        mockClient,
      );
    });

    it("should throw ForbiddenException when updating other user data", async () => {
      const userId = "2"; // Different user ID
      const updateUserDto = { name: "João Silva Atualizado" };

      mockClientService.updateUser.mockRejectedValue(
        new ForbiddenException("Acesso negado a dados de outro usuário"),
      );

      await expect(
        controller.updateUser(userId, updateUserDto, { user: mockClient }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe("updateProfilePicture", () => {
    it("should update profile picture successfully", async () => {
      const userId = "1";
      const updateProfilePictureDto = {
        profilePicture: "https://example.com/new-avatar.jpg",
      };

      const expectedResponse = {
        success: true,
        message: "Foto de perfil atualizada com sucesso",
        data: {
          id: 1,
          name: "João Silva",
          email: "joao@email.com",
          cpf: "123.456.789-00",
          phone: "(11) 99999-9999",
          picture: "https://example.com/new-avatar.jpg",
        },
      };

      mockClientService.updateProfilePicture.mockResolvedValue(
        expectedResponse,
      );

      const result = await controller.updateProfilePicture(
        userId,
        updateProfilePictureDto,
        { user: mockClient },
      );

      expect(result).toEqual(expectedResponse);
      expect(clientService.updateProfilePicture).toHaveBeenCalledWith(
        1,
        updateProfilePictureDto,
        mockClient,
      );
    });

    it("should throw ForbiddenException when updating other user profile picture", async () => {
      const userId = "2"; // Different user ID
      const updateProfilePictureDto = {
        profilePicture: "https://example.com/new-avatar.jpg",
      };

      mockClientService.updateProfilePicture.mockRejectedValue(
        new ForbiddenException("Acesso negado a dados de outro usuário"),
      );

      await expect(
        controller.updateProfilePicture(userId, updateProfilePictureDto, {
          user: mockClient,
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe("searchByCpf", () => {
    it("should search user by CPF successfully", async () => {
      const cpf = "123.456.789-00";
      const expectedResponse = {
        success: true,
        data: {
          id: 1,
          name: "João Silva",
          email: "joao@email.com",
          cpf: "123.456.789-00",
          phone: "(11) 99999-9999",
          picture: "https://example.com/joao.jpg",
          account: {
            id: 1,
            agency: "0001",
            accountNumber: "123456-7",
            balance: 5000.0,
          },
        },
      };

      mockClientService.searchByCpf.mockResolvedValue(expectedResponse);

      const result = await controller.searchByCpf(cpf, { user: mockClient });

      expect(result).toEqual(expectedResponse);
      expect(clientService.searchByCpf).toHaveBeenCalledWith(cpf, mockClient);
    });

    it("should throw ForbiddenException with invalid CPF", async () => {
      const cpf = "123"; // Invalid CPF
      mockClientService.searchByCpf.mockRejectedValue(
        new ForbiddenException("CPF inválido"),
      );

      await expect(
        controller.searchByCpf(cpf, { user: mockClient }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw NotFoundException when user not found", async () => {
      const cpf = "999.999.999-99";
      mockClientService.searchByCpf.mockRejectedValue(
        new NotFoundException("Usuário não encontrado"),
      );

      await expect(
        controller.searchByCpf(cpf, { user: mockClient }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
