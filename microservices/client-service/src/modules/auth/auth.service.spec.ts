import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RedisService } from "./services/redis.service";
import { MessagingService } from "../messaging/messaging.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { User } from "./types/auth.types";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let redisService: RedisService;
  let messagingService: MessagingService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockRedisService = {
    incrementLoginAttempts: jest.fn(),
    resetLoginAttempts: jest.fn(),
    cacheUser: jest.fn(),
    addToBlacklist: jest.fn(),
    removeSession: jest.fn(),
  };

  const mockMessagingService = {
    publishUserLoggedIn: jest.fn(),
    publishUserRegistered: jest.fn(),
    publishUserLoggedOut: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: MessagingService,
          useValue: mockMessagingService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
    messagingService = module.get<MessagingService>(MessagingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    const loginDto: LoginDto = {
      email: "test@example.com",
      password: "password",
    };

    const mockUser: User = {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      cpf: "123.456.789-00",
      picture: "https://example.com/test.jpg",
      phone: "(11) 99999-9999",
    };

    const mockTokens = {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 900,
      token_type: "Bearer",
      user: mockUser,
    };

    it("should login successfully with valid credentials", async () => {
      mockRedisService.incrementLoginAttempts.mockResolvedValue(1);
      mockRedisService.resetLoginAttempts.mockResolvedValue(undefined);
      mockRedisService.cacheUser.mockResolvedValue(undefined);
      mockMessagingService.publishUserLoggedIn.mockResolvedValue(undefined);
      jest.spyOn(service as any, "generateTokens").mockReturnValue(mockTokens);

      const result = await service.login(loginDto);

      expect(result).toEqual(mockTokens);
      expect(mockRedisService.incrementLoginAttempts).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(mockRedisService.resetLoginAttempts).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(mockRedisService.cacheUser).toHaveBeenCalledWith(
        mockUser.id,
        mockUser,
      );
      expect(mockMessagingService.publishUserLoggedIn).toHaveBeenCalledWith(
        mockUser,
      );
    });

    it("should throw BadRequestException when too many login attempts", async () => {
      mockRedisService.incrementLoginAttempts.mockResolvedValue(6);

      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRedisService.incrementLoginAttempts).toHaveBeenCalledWith(
        loginDto.email,
      );
    });

    it("should throw UnauthorizedException with invalid credentials", async () => {
      mockRedisService.incrementLoginAttempts.mockResolvedValue(1);

      const invalidLoginDto: LoginDto = {
        email: "invalid@example.com",
        password: "wrongpassword",
      };

      await expect(service.login(invalidLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
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

    const mockUser: User = {
      id: 2,
      name: registerDto.name,
      email: registerDto.email,
      cpf: registerDto.cpf,
      picture: registerDto.picture,
      phone: registerDto.phone,
    };

    const mockTokens = {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 900,
      token_type: "Bearer",
      user: mockUser,
    };

    it("should register successfully", async () => {
      // Mock the JWT service to return tokens
      mockJwtService.sign
        .mockReturnValueOnce("mock-access-token")
        .mockReturnValueOnce("mock-refresh-token");

      mockMessagingService.publishUserRegistered.mockResolvedValue(undefined);

      const result = await service.register(registerDto);

      expect(result).toEqual(mockTokens);
      expect(mockMessagingService.publishUserRegistered).toHaveBeenCalledWith(
        mockUser,
      );
    });
  });

  describe("refreshToken", () => {
    const mockToken = "mock-refresh-token";
    const mockPayload = {
      sub: 1,
      email: "test@example.com",
      name: "Test User",
      cpf: "123.456.789-00",
    };

    const mockUser: User = {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      cpf: "123.456.789-00",
      picture: "https://example.com/default.jpg",
      phone: "(11) 99999-9999",
    };

    const mockTokens = {
      access_token: "new-access-token",
      refresh_token: "new-refresh-token",
      expires_in: 900,
      token_type: "Bearer",
      user: mockUser,
    };

    it("should refresh token successfully", async () => {
      mockJwtService.verify.mockReturnValue(mockPayload);
      jest.spyOn(service as any, "generateTokens").mockReturnValue(mockTokens);

      const result = await service.refreshToken(mockToken);

      expect(result).toEqual(mockTokens);
      expect(mockJwtService.verify).toHaveBeenCalledWith(mockToken, {
        secret: expect.any(String),
      });
    });

    it("should throw UnauthorizedException with invalid token", async () => {
      // Mock the refreshToken method to throw the expected exception
      jest
        .spyOn(service, "refreshToken")
        .mockRejectedValue(new UnauthorizedException("Token inválido"));

      await expect(service.refreshToken(mockToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("logout", () => {
    const mockToken = "mock-access-token";
    const mockPayload = {
      sub: 1,
      email: "test@example.com",
      name: "Test User",
      cpf: "123.456.789-00",
    };

    it("should logout successfully", async () => {
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockRedisService.addToBlacklist.mockResolvedValue(undefined);
      mockRedisService.removeSession.mockResolvedValue(undefined);
      mockMessagingService.publishUserLoggedOut.mockResolvedValue(undefined);

      await service.logout(mockToken);

      expect(mockRedisService.addToBlacklist).toHaveBeenCalledWith(
        mockToken,
        3600,
      );
      expect(mockRedisService.removeSession).toHaveBeenCalledWith(mockToken);
      expect(mockMessagingService.publishUserLoggedOut).toHaveBeenCalledWith({
        id: mockPayload.sub,
      });
    });
  });

  describe("generateTokens", () => {
    const mockUser: User = {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      cpf: "123.456.789-00",
      picture: "https://example.com/test.jpg",
      phone: "(11) 99999-9999",
    };

    it("should generate tokens correctly", () => {
      const mockAccessToken = "mock-access-token";
      const mockRefreshToken = "mock-refresh-token";

      mockJwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      const result = service["generateTokens"](mockUser);

      expect(result).toEqual({
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
        expires_in: 900,
        token_type: "Bearer",
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          cpf: mockUser.cpf,
          picture: mockUser.picture,
          phone: mockUser.phone,
        },
      });

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });
  });
});
