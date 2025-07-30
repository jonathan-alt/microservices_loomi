import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

describe("AccountController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [".env.test", ".env"],
        }),
        TypeOrmModule.forRoot({
          type: "postgres",
          host: process.env.DB_HOST || "localhost",
          port: parseInt(process.env.DB_PORT || "5432"),
          username: process.env.DB_USERNAME || "test_user",
          password: process.env.DB_PASSWORD || "test_password",
          database: process.env.DB_NAME || "test_database",
          entities: ["src/**/*.entity.ts"],
          synchronize: true, // Apenas para testes
          logging: false,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("/accounts (POST)", () => {
    it("should create an account", () => {
      const createAccountDto = {
        client_id: 123,
        value: 1000,
        history_id: 1,
      };

      return request(app.getHttpServer())
        .post("/accounts")
        .send(createAccountDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.client_id).toBe(createAccountDto.client_id);
          expect(res.body.value).toBe(createAccountDto.value);
        });
    });

    it("should return 400 when creating account with invalid data", () => {
      const invalidDto = {
        client_id: -1, // Invalid negative value
        value: 1000,
        history_id: 1,
      };

      return request(app.getHttpServer())
        .post("/accounts")
        .send(invalidDto)
        .expect(400);
    });
  });

  describe("/accounts (GET)", () => {
    it("should return all accounts", () => {
      return request(app.getHttpServer())
        .get("/accounts")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe("/accounts/:id (GET)", () => {
    it("should return account by id", async () => {
      // First create an account
      const createAccountDto = {
        client_id: 456,
        value: 2000,
        history_id: 1,
      };

      const createResponse = await request(app.getHttpServer())
        .post("/accounts")
        .send(createAccountDto)
        .expect(201);

      const accountId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/accounts/${accountId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(accountId);
          expect(res.body.client_id).toBe(createAccountDto.client_id);
        });
    });

    it("should return 404 when account not found", () => {
      return request(app.getHttpServer()).get("/accounts/999999").expect(404);
    });
  });

  describe("/accounts/client/:clientId (GET)", () => {
    it("should return account by client id", async () => {
      // First create an account
      const createAccountDto = {
        client_id: 789,
        value: 3000,
        history_id: 1,
      };

      await request(app.getHttpServer())
        .post("/accounts")
        .send(createAccountDto)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/accounts/client/${createAccountDto.client_id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.client_id).toBe(createAccountDto.client_id);
        });
    });
  });

  describe("/accounts/:id (PATCH)", () => {
    it("should update account", async () => {
      // First create an account
      const createAccountDto = {
        client_id: 101,
        value: 1000,
        history_id: 1,
      };

      const createResponse = await request(app.getHttpServer())
        .post("/accounts")
        .send(createAccountDto)
        .expect(201);

      const accountId = createResponse.body.id;
      const updateDto = { value: 1500 };

      return request(app.getHttpServer())
        .patch(`/accounts/${accountId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.value).toBe(updateDto.value);
        });
    });

    it("should return 404 when updating non-existent account", () => {
      const updateDto = { value: 1500 };

      return request(app.getHttpServer())
        .patch("/accounts/999999")
        .send(updateDto)
        .expect(404);
    });
  });

  describe("/accounts/transfer (POST)", () => {
    it("should perform transfer between accounts", async () => {
      // Create sender account
      const senderAccount = await request(app.getHttpServer())
        .post("/accounts")
        .send({
          client_id: 201,
          value: 1000,
          history_id: 1,
        })
        .expect(201);

      // Create receiver account
      const receiverAccount = await request(app.getHttpServer())
        .post("/accounts")
        .send({
          client_id: 202,
          value: 500,
          history_id: 1,
        })
        .expect(201);

      const transferDto = {
        senderUserId: 201,
        receiverUserId: 202,
        amount: 100,
        description: "Test transfer",
      };

      return request(app.getHttpServer())
        .post("/accounts/transfer")
        .send(transferDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.value).toBe(900); // 1000 - 100
        });
    });

    it("should return 400 when transfer amount is invalid", () => {
      const transferDto = {
        senderUserId: 201,
        receiverUserId: 202,
        amount: -100, // Invalid negative amount
        description: "Test transfer",
      };

      return request(app.getHttpServer())
        .post("/accounts/transfer")
        .send(transferDto)
        .expect(400);
    });

    it("should return 400 when sender and receiver are the same", () => {
      const transferDto = {
        senderUserId: 201,
        receiverUserId: 201, // Same user
        amount: 100,
        description: "Test transfer",
      };

      return request(app.getHttpServer())
        .post("/accounts/transfer")
        .send(transferDto)
        .expect(400);
    });
  });

  describe("/accounts/:id (DELETE)", () => {
    it("should delete account", async () => {
      // First create an account
      const createAccountDto = {
        client_id: 301,
        value: 1000,
        history_id: 1,
      };

      const createResponse = await request(app.getHttpServer())
        .post("/accounts")
        .send(createAccountDto)
        .expect(201);

      const accountId = createResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/accounts/${accountId}`)
        .expect(200);
    });

    it("should return 404 when deleting non-existent account", () => {
      return request(app.getHttpServer())
        .delete("/accounts/999999")
        .expect(404);
    });
  });
});
