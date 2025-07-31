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
    .setTitle("Transfer Service API")
    .setDescription(
      "API para gerenciamento de transferências e contas bancárias",
    )
    .setVersion("1.0")
    .addTag("accounts", "Operações de contas bancárias")
    .addTag("transfers", "Operações de transferências")
    .addTag("history", "Histórico de transferências")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(appConfig.port);
  console.log(`Transfer Service rodando na porta ${appConfig.port}`);
  console.log(
    `📚 Swagger disponível em: http://localhost:${appConfig.port}/api/docs`,
  );
}
void bootstrap();
