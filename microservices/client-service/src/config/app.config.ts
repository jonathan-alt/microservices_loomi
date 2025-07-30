export const appConfig = {
  port: parseInt(process.env.PORT || "3001"),
  apiPrefix: process.env.API_PREFIX || "api",
  environment: process.env.NODE_ENV || "development",
};
