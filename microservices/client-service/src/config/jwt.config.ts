export interface JwtConfig {
  secret: string;
  signOptions: {
    expiresIn: string;
  };
  refreshExpiresIn: string;
}

export const jwtConfig: JwtConfig = {
  secret:
    process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  },
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};
