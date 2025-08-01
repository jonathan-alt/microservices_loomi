import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RedisService } from "./services/redis.service";
import { BlacklistGuard } from "./guards/blacklist.guard";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Client } from "./types/auth.types";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;
  let redisService: RedisService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  };

  const mockRedisService = {
    isBlacklisted: jest.fn(),
    addToBlacklist: jest.fn(),
    removeSession: jest.fn(),
  };

  const mockBlacklistGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: BlacklistGuard,
          useValue: mockBlacklistGuard,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("login", () => {
    const loginDto: LoginDto = {
      email: "test@example.com",
      password: "password",
    };

    const mockResponse = {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 900,
      token_type: "Bearer",
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        cpf: "123.456.789-00",
        picture: "https://example.com/test.jpg",
        phone: "(11) 99999-9999",
      },
    };

    it("should login successfully", async () => {
      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe("register", () => {
    const registerDto: RegisterDto = {
      name: "New User",
      cpf: "987.654.321-00",
      picture: "https://example.com/new.jpg",
      email: "new@example.com",
      phone: "(11) 88888-8888",
      password: "newpassword",
    };

    const mockResponse = {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 900,
      token_type: "Bearer",
      user: {
        id: 2,
        name: "New User",
        email: "new@example.com",
        cpf: "987.654.321-00",
        picture: "https://example.com/new.jpg",
        phone: "(11) 88888-8888",
      },
    };

    it("should register successfully", async () => {
      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe("refreshToken", () => {
    const refreshBody = { refresh_token: "mock-refresh-token" };

    const mockResponse = {
      access_token: "new-access-token",
      refresh_token: "new-refresh-token",
      expires_in: 900,
      token_type: "Bearer",
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        cpf: "123.456.789-00",
        picture: "https://example.com/test.jpg",
        phone: "(11) 99999-9999",
      },
    };

    it("should refresh token successfully", async () => {
      mockAuthService.refreshToken.mockResolvedValue(mockResponse);

      const result = await controller.refreshToken(refreshBody);

      expect(result).toEqual(mockResponse);
      expect(authService.refreshToken).toHaveBeenCalledWith(
        refreshBody.refresh_token,
      );
    });
  });

  describe("logout", () => {
    const mockRequest = {
      headers: {
        authorization: "Bearer mock-access-token",
      },
    };

    it("should logout successfully", async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(mockRequest as any);

      expect(result).toEqual({ message: "Logout realizado com sucesso" });
      expect(authService.logout).toHaveBeenCalledWith("mock-access-token");
    });

    it("should handle logout without token", async () => {
      const requestWithoutToken = {
        headers: {},
      };

      const result = await controller.logout(requestWithoutToken as any);

      expect(result).toEqual({ message: "Logout realizado com sucesso" });
      expect(authService.logout).not.toHaveBeenCalled();
    });
  });

  describe("getProfile", () => {
    const mockUser: Client = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      cpf: "123.456.789-00",
      picture: "https://example.com/test.jpg",
      phone: "(11) 99999-9999",
    };

    const mockRequest = {
      user: mockUser,
    };

    it("should return user profile", () => {
      const result = controller.getProfile(mockRequest as any);

      expect(result).toEqual(mockUser);
    });
  });
});
