import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { redisConfig } from "../../../config/redis.config";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      db: redisConfig.db,
    });

    this.redis.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    this.redis.on("connect", () => {
      console.log("✅ Redis connected successfully");
    });
  }

  // Blacklist de tokens revogados
  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    await this.redis.setex(`blacklist:${token}`, expiresIn, "revoked");
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redis.get(`blacklist:${token}`);
    return result === "revoked";
  }

  // Cache de dados de usuário
  async cacheUser(
    userId: number,
    userData: any,
    ttl: number = 300,
  ): Promise<void> {
    await this.redis.setex(`user:${userId}`, ttl, JSON.stringify(userData));
  }

  async getCachedUser(userId: number): Promise<any | null> {
    const data = await this.redis.get(`user:${userId}`);
    return data ? JSON.parse(data) : null;
  }

  async removeCachedUser(userId: number): Promise<void> {
    await this.redis.del(`user:${userId}`);
  }

  // Rate limiting para login
  async incrementLoginAttempts(email: string): Promise<number> {
    const key = `login_attempts:${email}`;
    const attempts = await this.redis.incr(key);
    await this.redis.expire(key, 900); // 15 minutos
    return attempts;
  }

  async getLoginAttempts(email: string): Promise<number> {
    const key = `login_attempts:${email}`;
    const attempts = await this.redis.get(key);
    return attempts ? parseInt(attempts, 10) : 0;
  }

  async resetLoginAttempts(email: string): Promise<void> {
    const key = `login_attempts:${email}`;
    await this.redis.del(key);
  }

  // Sessões ativas
  async addActiveSession(
    userId: number,
    sessionId: string,
    ttl: number = 3600,
  ): Promise<void> {
    await this.redis.setex(`session:${sessionId}`, ttl, userId.toString());
    await this.redis.sadd(`user_sessions:${userId}`, sessionId);
  }

  async removeSession(sessionId: string): Promise<void> {
    const userId = await this.redis.get(`session:${sessionId}`);
    if (userId) {
      await this.redis.srem(`user_sessions:${userId}`, sessionId);
    }
    await this.redis.del(`session:${sessionId}`);
  }

  async getActiveSessions(userId: number): Promise<string[]> {
    return await this.redis.smembers(`user_sessions:${userId}`);
  }

  // Limpeza de dados expirados
  async cleanupExpiredData(): Promise<void> {
    // Remove sessões expiradas
    const keys = await this.redis.keys("session:*");
    for (const key of keys) {
      const ttl = await this.redis.ttl(key);
      if (ttl === -1) {
        await this.redis.del(key);
      }
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
