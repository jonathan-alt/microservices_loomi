import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
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

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle("Client Service API")
    .setDescription("API para gerenciamento de clientes e usuários")
    .setVersion("1.0")
    .addTag("auth", "Autenticação e autorização")
    .addTag("users", "Operações de usuários")
    .addTag("clients", "Operações de clientes")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(appConfig.port);
  console.log(`Client Service rodando na porta ${appConfig.port}`);
  console.log(
    `📚 Swagger disponível em: http://localhost:${appConfig.port}/api/docs`,
  );
}

void bootstrap();
