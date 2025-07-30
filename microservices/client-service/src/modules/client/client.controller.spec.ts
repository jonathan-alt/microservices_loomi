import { Test, TestingModule } from "@nestjs/testing";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { User as AuthUser } from "../auth/types/auth.types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfilePictureDto } from "./dto/update-profile-picture.dto";

describe("ClientController", () => {
  let controller: ClientController;
  let clientService: ClientService;

  const mockClientService = {
    getUserDetails: jest.fn(),
    updateUser: jest.fn(),
    updateProfilePicture: jest.fn(),
    searchByCpf: jest.fn(),
  };

  const mockUser: AuthUser = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    picture: "https://example.com/joao.jpg",
    phone: "(11) 99999-9999",
  };

  const mockUserDetails = {
    success: true,
    data: {
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
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: mockClientService,
        },
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    clientService = module.get<ClientService>(ClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserDetails", () => {
    it("should return user details", async () => {
      mockClientService.getUserDetails.mockResolvedValue(mockUserDetails);

      const result = await controller.getUserDetails(1, mockUser);

      expect(result).toEqual(mockUserDetails);
      expect(clientService.getUserDetails).toHaveBeenCalledWith(1, mockUser);
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

    const mockUpdateResponse = {
      success: true,
      message: "Dados do usuário atualizados com sucesso",
      data: {
        id: 1,
        name: "João Silva Updated",
        email: "joao.updated@email.com",
        cpf: "123.456.789-00",
        phone: "(11) 99999-9999",
        picture: "https://example.com/joao.jpg",
        address: "Nova Rua, 456 - São Paulo, SP",
        bankingDetails: {
          agency: "0002",
          accountNumber: "654321-0",
        },
      },
    };

    it("should update user successfully", async () => {
      mockClientService.updateUser.mockResolvedValue(mockUpdateResponse);

      const result = await controller.updateUser(1, updateUserDto, mockUser);

      expect(result).toEqual(mockUpdateResponse);
      expect(clientService.updateUser).toHaveBeenCalledWith(
        1,
        updateUserDto,
        mockUser,
      );
    });
  });

  describe("updateProfilePicture", () => {
    const updateProfilePictureDto: UpdateProfilePictureDto = {
      profilePicture: "https://example.com/new-picture.jpg",
    };

    const mockUpdatePictureResponse = {
      success: true,
      message: "Foto de perfil atualizada com sucesso",
      data: {
        id: 1,
        name: "João Silva",
        email: "joao@email.com",
        cpf: "123.456.789-00",
        phone: "(11) 99999-9999",
        picture: "https://example.com/new-picture.jpg",
        address: "Rua das Flores, 123 - São Paulo, SP",
      },
    };

    it("should update profile picture successfully", async () => {
      mockClientService.updateProfilePicture.mockResolvedValue(
        mockUpdatePictureResponse,
      );

      const result = await controller.updateProfilePicture(
        1,
        updateProfilePictureDto,
        mockUser,
      );

      expect(result).toEqual(mockUpdatePictureResponse);
      expect(clientService.updateProfilePicture).toHaveBeenCalledWith(
        1,
        updateProfilePictureDto,
        mockUser,
      );
    });
  });

  describe("searchByCpf", () => {
    const mockSearchResponse = {
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

    it("should return user data by CPF", async () => {
      mockClientService.searchByCpf.mockResolvedValue(mockSearchResponse);

      const result = await controller.searchByCpf("123.456.789-00", mockUser);

      expect(result).toEqual(mockSearchResponse);
      expect(clientService.searchByCpf).toHaveBeenCalledWith(
        "123.456.789-00",
        mockUser,
      );
    });
  });
});
