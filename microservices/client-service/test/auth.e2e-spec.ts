import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("AuthController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/api/auth/login (POST)", () => {
    it("should login successfully with valid credentials", () => {
      return request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password",
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("access_token");
          expect(res.body).toHaveProperty("refresh_token");
          expect(res.body).toHaveProperty("expires_in");
          expect(res.body).toHaveProperty("token_type");
          expect(res.body).toHaveProperty("user");
          expect(res.body.token_type).toBe("Bearer");
          expect(res.body.user.email).toBe("test@example.com");
        });
    });

    it("should fail with invalid credentials", () => {
      return request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: "invalid@example.com",
          password: "wrongpassword",
        })
        .expect(401);
    });

    it("should fail with missing email", () => {
      return request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          password: "password",
        })
        .expect(400);
    });

    it("should fail with missing password", () => {
      return request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
        })
        .expect(400);
    });
  });

  describe("/api/auth/register (POST)", () => {
    it("should register successfully with valid data", () => {
      return request(app.getHttpServer())
        .post("/api/auth/register")
        .send({
          name: "New User",
          cpf: "987.654.321-00",
          picture: "https://example.com/new.jpg",
          email: "new@example.com",
          phone: "(11) 88888-8888",
          password: "newpassword",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("access_token");
          expect(res.body).toHaveProperty("refresh_token");
          expect(res.body).toHaveProperty("user");
          expect(res.body.user.name).toBe("New User");
          expect(res.body.user.email).toBe("new@example.com");
        });
    });

    it("should fail with invalid email", () => {
      return request(app.getHttpServer())
        .post("/api/auth/register")
        .send({
          name: "New User",
          cpf: "987.654.321-00",
          picture: "https://example.com/new.jpg",
          email: "invalid-email",
          phone: "(11) 88888-8888",
          password: "newpassword",
        })
        .expect(400);
    });

    it("should fail with short password", () => {
      return request(app.getHttpServer())
        .post("/api/auth/register")
        .send({
          name: "New User",
          cpf: "987.654.321-00",
          picture: "https://example.com/new.jpg",
          email: "new@example.com",
          phone: "(11) 88888-8888",
          password: "123",
        })
        .expect(400);
    });
  });

  describe("/api/auth/refresh (POST)", () => {
    let refreshToken: string;

    beforeAll(async () => {
      // Get a refresh token by logging in
      const response = await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password",
        });

      refreshToken = response.body.refresh_token;
    });

    it("should refresh token successfully", () => {
      return request(app.getHttpServer())
        .post("/api/auth/refresh")
        .send({
          refresh_token: refreshToken,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("access_token");
          expect(res.body).toHaveProperty("refresh_token");
          expect(res.body).toHaveProperty("expires_in");
          expect(res.body).toHaveProperty("token_type");
          expect(res.body).toHaveProperty("user");
        });
    });

    it("should fail with invalid refresh token", () => {
      return request(app.getHttpServer())
        .post("/api/auth/refresh")
        .send({
          refresh_token: "invalid-token",
        })
        .expect(401);
    });
  });

  describe("/api/auth/logout (POST)", () => {
    let accessToken: string;

    beforeAll(async () => {
      // Get an access token by logging in
      const response = await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password",
        });

      accessToken = response.body.access_token;
    });

    it("should logout successfully with valid token", () => {
      return request(app.getHttpServer())
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toBe("Logout realizado com sucesso");
        });
    });

    it("should fail without authorization header", () => {
      return request(app.getHttpServer()).post("/api/auth/logout").expect(401);
    });

    it("should fail with invalid token", () => {
      return request(app.getHttpServer())
        .post("/api/auth/logout")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);
    });
  });

  describe("/api/auth/me (POST)", () => {
    let accessToken: string;

    beforeAll(async () => {
      // Get an access token by logging in
      const response = await request(app.getHttpServer())
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password",
        });

      accessToken = response.body.access_token;
    });

    it("should return user profile with valid token", () => {
      return request(app.getHttpServer())
        .post("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty("id");
          expect(res.body).toHaveProperty("name");
          expect(res.body).toHaveProperty("email");
          expect(res.body).toHaveProperty("cpf");
          expect(res.body).toHaveProperty("picture");
          expect(res.body.email).toBe("test@example.com");
        });
    });

    it("should fail without authorization header", () => {
      return request(app.getHttpServer()).post("/api/auth/me").expect(401);
    });

    it("should fail with invalid token", () => {
      return request(app.getHttpServer())
        .post("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);
    });
  });
});
