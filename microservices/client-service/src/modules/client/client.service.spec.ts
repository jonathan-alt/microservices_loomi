import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { ClientService } from "./client.service";
import { UserRepository } from "./repositories/user.repository";
import { TransferClientService } from "./services/transfer-client.service";
import { User as AuthUser } from "../auth/types/auth.types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfilePictureDto } from "./dto/update-profile-picture.dto";

describe("ClientService", () => {
  let service: ClientService;
  let userRepository: UserRepository;
  let transferClientService: TransferClientService;

  const mockUserRepository = {
    findById: jest.fn(),
    findByCpf: jest.fn(),
    update: jest.fn(),
  };

  const mockTransferClientService = {
    getAccountDetails: jest.fn(),
  };

  const mockUser: AuthUser = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    picture: "https://example.com/joao.jpg",
    phone: "(11) 99999-9999",
  };

  const mockDbUser = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    phone: "(11) 99999-9999",
    picture: "https://example.com/joao.jpg",
    address: "Rua das Flores, 123 - São Paulo, SP",
    agency: "0001",
    account_number: "123456-7",
  };

  const mockAccountDetails = {
    id: 1,
    agency: "0001",
    account_number: "123456-7",
    balance: 5000.0,
    client_id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: TransferClientService,
          useValue: mockTransferClientService,
        },
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
    it("should return user details with banking information", async () => {
      mockUserRepository.findById.mockResolvedValue(mockDbUser);
      mockTransferClientService.getAccountDetails.mockResolvedValue(
        mockAccountDetails,
      );

      const result = await service.getUserDetails(1, mockUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        name: "João Silva",
        email: "joao@email.com",
        cpf: "123.456.789-00",
        phone: "(11) 99999-9999",
        picture: "https://example.com/joao.jpg",
        address: "Rua das Flores, 123 - São Paulo, SP",
        bankingDetails: {
          agency: "0001",
          accountNumber: "123456-7",
          balance: 5000.0,
          accountId: 1,
        },
      });
    });

    it("should throw ForbiddenException when accessing another user data", async () => {
      await expect(service.getUserDetails(2, mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("should throw NotFoundException when user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.getUserDetails(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should return user details without banking information when account not found", async () => {
      mockUserRepository.findById.mockResolvedValue(mockDbUser);
      mockTransferClientService.getAccountDetails.mockRejectedValue(
        new Error("Not found"),
      );

      const result = await service.getUserDetails(1, mockUser);

      expect(result.success).toBe(true);
      expect(result.data.bankingDetails).toBeNull();
    });
  });

  describe("updateUser", () => {
    const updateUserDto: UpdateUserDto = {
      name: "João Silva Updated",
      email: "joao.updated@email.com",
      address: "Nova Rua, 456 - São Paulo, SP",
      bankingDetails: {
        agency: "0002",
        accountNumber: "654321-0",
      },
    };

    it("should update user successfully", async () => {
      const updatedUser = { ...mockDbUser, ...updateUserDto };
      mockUserRepository.findById.mockResolvedValue(mockDbUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, updateUserDto, mockUser);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Dados do usuário atualizados com sucesso");
      expect(result.data.name).toBe("João Silva Updated");
    });

    it("should throw ForbiddenException when updating another user data", async () => {
      await expect(
        service.updateUser(2, updateUserDto, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw NotFoundException when user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateUser(1, updateUserDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("updateProfilePicture", () => {
    const updateProfilePictureDto: UpdateProfilePictureDto = {
      profilePicture: "https://example.com/new-picture.jpg",
    };

    it("should update profile picture successfully", async () => {
      const updatedUser = {
        ...mockDbUser,
        picture: updateProfilePictureDto.profilePicture,
      };
      mockUserRepository.findById.mockResolvedValue(mockDbUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfilePicture(
        1,
        updateProfilePictureDto,
        mockUser,
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe("Foto de perfil atualizada com sucesso");
      expect(result.data.picture).toBe("https://example.com/new-picture.jpg");
    });

    it("should throw ForbiddenException when updating another user picture", async () => {
      await expect(
        service.updateProfilePicture(2, updateProfilePictureDto, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw NotFoundException when user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateProfilePicture(1, updateProfilePictureDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("searchByCpf", () => {
    it("should return user data with account information", async () => {
      mockUserRepository.findByCpf.mockResolvedValue(mockDbUser);
      mockTransferClientService.getAccountDetails.mockResolvedValue(
        mockAccountDetails,
      );

      const result = await service.searchByCpf("123.456.789-00", mockUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
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
      });
    });

    it("should throw ForbiddenException with invalid CPF", async () => {
      await expect(service.searchByCpf("123", mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("should throw NotFoundException when user not found", async () => {
      mockUserRepository.findByCpf.mockResolvedValue(null);

      await expect(
        service.searchByCpf("123.456.789-00", mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it("should return user data without account when account not found", async () => {
      mockUserRepository.findByCpf.mockResolvedValue(mockDbUser);
      mockTransferClientService.getAccountDetails.mockRejectedValue(
        new Error("Not found"),
      );

      const result = await service.searchByCpf("123.456.789-00", mockUser);

      expect(result.success).toBe(true);
      expect(result.data.account).toBeNull();
    });
  });
});
