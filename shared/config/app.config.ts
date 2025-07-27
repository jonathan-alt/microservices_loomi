export interface AppConfig {
  port: number;
  environment: string;
  apiPrefix: string;
}

export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  environment: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "api/v1",
};
