import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { appConfig } from "./config/app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração global de validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefixo global da API
  app.setGlobalPrefix(appConfig.apiPrefix);

  // Configuração de CORS
  app.enableCors();

  await app.listen(appConfig.port);
  console.log(`Client Service rodando na porta ${appConfig.port}`);
}

bootstrap(); 