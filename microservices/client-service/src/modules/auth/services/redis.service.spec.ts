import { Test, TestingModule } from "@nestjs/testing";
import { RedisService } from "./redis.service";

describe("RedisService", () => {
  let service: RedisService;
  let mockRedis: any;

  beforeEach(async () => {
    mockRedis = {
      setex: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      incr: jest.fn(),
      expire: jest.fn(),
      sadd: jest.fn(),
      srem: jest.fn(),
      smembers: jest.fn(),
      keys: jest.fn(),
      ttl: jest.fn(),
      quit: jest.fn(),
      on: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: "REDIS_CLIENT",
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    // Mock the Redis client creation
    (service as any).redis = mockRedis;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("addToBlacklist", () => {
    it("should add token to blacklist", async () => {
      const token = "test-token";
      const expiresIn = 3600;

      mockRedis.setex.mockResolvedValue("OK");

      await service.addToBlacklist(token, expiresIn);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        `blacklist:${token}`,
        expiresIn,
        "revoked",
      );
    });
  });

  describe("isBlacklisted", () => {
    it("should return true when token is blacklisted", async () => {
      const token = "test-token";

      mockRedis.get.mockResolvedValue("revoked");

      const result = await service.isBlacklisted(token);

      expect(result).toBe(true);
      expect(mockRedis.get).toHaveBeenCalledWith(`blacklist:${token}`);
    });

    it("should return false when token is not blacklisted", async () => {
      const token = "test-token";

      mockRedis.get.mockResolvedValue(null);

      const result = await service.isBlacklisted(token);

      expect(result).toBe(false);
      expect(mockRedis.get).toHaveBeenCalledWith(`blacklist:${token}`);
    });
  });

  describe("cacheUser", () => {
    it("should cache user data", async () => {
      const userId = 1;
      const userData = { id: 1, name: "Test User" };
      const ttl = 300;

      mockRedis.setex.mockResolvedValue("OK");

      await service.cacheUser(userId, userData, ttl);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        `user:${userId}`,
        ttl,
        JSON.stringify(userData),
      );
    });
  });

  describe("getCachedUser", () => {
    it("should return cached user data", async () => {
      const userId = 1;
      const userData = { id: 1, name: "Test User" };

      mockRedis.get.mockResolvedValue(JSON.stringify(userData));

      const result = await service.getCachedUser(userId);

      expect(result).toEqual(userData);
      expect(mockRedis.get).toHaveBeenCalledWith(`user:${userId}`);
    });

    it("should return null when user is not cached", async () => {
      const userId = 1;

      mockRedis.get.mockResolvedValue(null);

      const result = await service.getCachedUser(userId);

      expect(result).toBeNull();
      expect(mockRedis.get).toHaveBeenCalledWith(`user:${userId}`);
    });
  });

  describe("removeCachedUser", () => {
    it("should remove cached user", async () => {
      const userId = 1;

      mockRedis.del.mockResolvedValue(1);

      await service.removeCachedUser(userId);

      expect(mockRedis.del).toHaveBeenCalledWith(`user:${userId}`);
    });
  });

  describe("incrementLoginAttempts", () => {
    it("should increment login attempts", async () => {
      const email = "test@example.com";

      mockRedis.incr.mockResolvedValue(2);
      mockRedis.expire.mockResolvedValue(1);

      const result = await service.incrementLoginAttempts(email);

      expect(result).toBe(2);
      expect(mockRedis.incr).toHaveBeenCalledWith(`login_attempts:${email}`);
      expect(mockRedis.expire).toHaveBeenCalledWith(
        `login_attempts:${email}`,
        900,
      );
    });
  });

  describe("getLoginAttempts", () => {
    it("should return login attempts count", async () => {
      const email = "test@example.com";

      mockRedis.get.mockResolvedValue("3");

      const result = await service.getLoginAttempts(email);

      expect(result).toBe(3);
      expect(mockRedis.get).toHaveBeenCalledWith(`login_attempts:${email}`);
    });

    it("should return 0 when no attempts", async () => {
      const email = "test@example.com";

      mockRedis.get.mockResolvedValue(null);

      const result = await service.getLoginAttempts(email);

      expect(result).toBe(0);
      expect(mockRedis.get).toHaveBeenCalledWith(`login_attempts:${email}`);
    });
  });

  describe("resetLoginAttempts", () => {
    it("should reset login attempts", async () => {
      const email = "test@example.com";

      mockRedis.del.mockResolvedValue(1);

      await service.resetLoginAttempts(email);

      expect(mockRedis.del).toHaveBeenCalledWith(`login_attempts:${email}`);
    });
  });

  describe("addActiveSession", () => {
    it("should add active session", async () => {
      const userId = 1;
      const sessionId = "session-123";
      const ttl = 3600;

      mockRedis.setex.mockResolvedValue("OK");
      mockRedis.sadd.mockResolvedValue(1);

      await service.addActiveSession(userId, sessionId, ttl);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        `session:${sessionId}`,
        ttl,
        userId.toString(),
      );
      expect(mockRedis.sadd).toHaveBeenCalledWith(
        `user_sessions:${userId}`,
        sessionId,
      );
    });
  });

  describe("removeSession", () => {
    it("should remove session", async () => {
      const sessionId = "session-123";
      const userId = 1;

      mockRedis.get.mockResolvedValue(userId.toString());
      mockRedis.srem.mockResolvedValue(1);
      mockRedis.del.mockResolvedValue(1);

      await service.removeSession(sessionId);

      expect(mockRedis.get).toHaveBeenCalledWith(`session:${sessionId}`);
      expect(mockRedis.srem).toHaveBeenCalledWith(
        `user_sessions:${userId}`,
        sessionId,
      );
      expect(mockRedis.del).toHaveBeenCalledWith(`session:${sessionId}`);
    });

    it("should handle session not found", async () => {
      const sessionId = "session-123";

      mockRedis.get.mockResolvedValue(null);
      mockRedis.del.mockResolvedValue(0);

      await service.removeSession(sessionId);

      expect(mockRedis.get).toHaveBeenCalledWith(`session:${sessionId}`);
      expect(mockRedis.del).toHaveBeenCalledWith(`session:${sessionId}`);
    });
  });

  describe("getActiveSessions", () => {
    it("should return active sessions", async () => {
      const userId = 1;
      const sessions = ["session-1", "session-2"];

      mockRedis.smembers.mockResolvedValue(sessions);

      const result = await service.getActiveSessions(userId);

      expect(result).toEqual(sessions);
      expect(mockRedis.smembers).toHaveBeenCalledWith(
        `user_sessions:${userId}`,
      );
    });
  });

  describe("cleanupExpiredData", () => {
    it("should cleanup expired data", async () => {
      const keys = ["session:1", "session:2"];

      mockRedis.keys.mockResolvedValue(keys);
      mockRedis.ttl
        .mockResolvedValueOnce(-1) // expired
        .mockResolvedValueOnce(300); // not expired

      await service.cleanupExpiredData();

      expect(mockRedis.keys).toHaveBeenCalledWith("session:*");
      expect(mockRedis.ttl).toHaveBeenCalledTimes(2);
      expect(mockRedis.del).toHaveBeenCalledWith("session:1");
    });
  });

  describe("onModuleDestroy", () => {
    it("should quit Redis connection", async () => {
      mockRedis.quit.mockResolvedValue("OK");

      await service.onModuleDestroy();

      expect(mockRedis.quit).toHaveBeenCalled();
    });
  });
});
