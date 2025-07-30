import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

describe("HistoryTransferController (e2e)", () => {
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

  describe("/history_transfer (POST)", () => {
    it("should create a history transfer", () => {
      const createHistoryDto = {
        account_id: 1,
        transfer_value: 100,
        target_id_account: 2,
        description: "Test transfer",
        new_value: 900,
        old_value: 1000,
        type: "TRANSFER-SENT",
        timestamp: new Date().toISOString(),
      };

      return request(app.getHttpServer())
        .post("/history_transfer")
        .send(createHistoryDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body.account_id).toBe(createHistoryDto.account_id);
          expect(res.body.transfer_value).toBe(createHistoryDto.transfer_value);
        });
    });

    it("should return 400 when creating history transfer with invalid data", () => {
      const invalidDto = {
        account_id: -1, // Invalid negative value
        transfer_value: 100,
        target_id_account: 2,
        description: "Test transfer",
        new_value: 900,
        old_value: 1000,
        type: "TRANSFER-SENT",
        timestamp: new Date().toISOString(),
      };

      return request(app.getHttpServer())
        .post("/history_transfer")
        .send(invalidDto)
        .expect(400);
    });
  });

  describe("/history_transfer (GET)", () => {
    it("should return all history transfers", () => {
      return request(app.getHttpServer())
        .get("/history_transfer")
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe("/history_transfer/:id (GET)", () => {
    it("should return history transfer by id", async () => {
      // First create a history transfer
      const createHistoryDto = {
        account_id: 3,
        transfer_value: 200,
        target_id_account: 4,
        description: "Test transfer by id",
        new_value: 800,
        old_value: 1000,
        type: "TRANSFER-SENT",
        timestamp: new Date().toISOString(),
      };

      const createResponse = await request(app.getHttpServer())
        .post("/history_transfer")
        .send(createHistoryDto)
        .expect(201);

      const historyId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/history_transfer/${historyId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(historyId);
          expect(res.body.account_id).toBe(createHistoryDto.account_id);
        });
    });

    it("should return 404 when history transfer not found", () => {
      return request(app.getHttpServer())
        .get("/history_transfer/999999")
        .expect(404);
    });
  });

  describe("/history_transfer/account/:accountId (GET)", () => {
    it("should return history transfers by account id", async () => {
      // First create a history transfer
      const createHistoryDto = {
        account_id: 5,
        transfer_value: 300,
        target_id_account: 6,
        description: "Test transfer by account",
        new_value: 700,
        old_value: 1000,
        type: "TRANSFER-SENT",
        timestamp: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post("/history_transfer")
        .send(createHistoryDto)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/history_transfer/account/${createHistoryDto.account_id}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            expect(res.body[0].account_id).toBe(createHistoryDto.account_id);
          }
        });
    });
  });

  describe("/history_transfer/:id (PATCH)", () => {
    it("should update history transfer", async () => {
      // First create a history transfer
      const createHistoryDto = {
        account_id: 7,
        transfer_value: 400,
        target_id_account: 8,
        description: "Original description",
        new_value: 600,
        old_value: 1000,
        type: "TRANSFER-SENT",
        timestamp: new Date().toISOString(),
      };

      const createResponse = await request(app.getHttpServer())
        .post("/history_transfer")
        .send(createHistoryDto)
        .expect(201);

      const historyId = createResponse.body.id;
      const updateDto = { description: "Updated description" };

      return request(app.getHttpServer())
        .patch(`/history_transfer/${historyId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.description).toBe(updateDto.description);
        });
    });

    it("should return 404 when updating non-existent history transfer", () => {
      const updateDto = { description: "Updated description" };

      return request(app.getHttpServer())
        .patch("/history_transfer/999999")
        .send(updateDto)
        .expect(404);
    });
  });

  describe("/history_transfer/:id (DELETE)", () => {
    it("should delete history transfer", async () => {
      // First create a history transfer
      const createHistoryDto = {
        account_id: 9,
        transfer_value: 500,
        target_id_account: 10,
        description: "Test transfer to delete",
        new_value: 500,
        old_value: 1000,
        type: "TRANSFER-SENT",
        timestamp: new Date().toISOString(),
      };

      const createResponse = await request(app.getHttpServer())
        .post("/history_transfer")
        .send(createHistoryDto)
        .expect(201);

      const historyId = createResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/history_transfer/${historyId}`)
        .expect(200);
    });

    it("should return 404 when deleting non-existent history transfer", () => {
      return request(app.getHttpServer())
        .delete("/history_transfer/999999")
        .expect(404);
    });
  });
});
