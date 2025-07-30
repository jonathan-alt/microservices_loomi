import { Test, TestingModule } from "@nestjs/testing";
import { HttpService } from "@nestjs/axios";
import {
  TransferClientService,
  AccountDetails,
} from "./transfer-client.service";
import { HttpException, HttpStatus } from "@nestjs/common";
import { of, throwError } from "rxjs";

describe("TransferClientService", () => {
  let service: TransferClientService;
  let httpService: HttpService;

  const mockAccountDetails: AccountDetails = {
    id: 1,
    agency: "0001",
    account_number: "123456-7",
    balance: 5000.0,
    client_id: 1,
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferClientService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<TransferClientService>(TransferClientService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAccountDetails", () => {
    it("should return account details successfully", async () => {
      const userId = 1;
      const mockResponse = {
        data: mockAccountDetails,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getAccountDetails(userId);

      expect(result).toEqual(mockAccountDetails);
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/accounts/client/1"),
      );
    });

    it("should throw HttpException when account not found", async () => {
      const userId = 999;
      const mockError = {
        response: {
          status: 404,
          data: "Account not found",
        },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getAccountDetails(userId)).rejects.toThrow(
        HttpException,
      );
      await expect(service.getAccountDetails(userId)).rejects.toThrow(
        "Conta não encontrada",
      );
    });

    it("should throw HttpException for other errors", async () => {
      const userId = 1;
      const mockError = {
        response: {
          status: 500,
          data: "Internal server error",
        },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getAccountDetails(userId)).rejects.toThrow(
        HttpException,
      );
      await expect(service.getAccountDetails(userId)).rejects.toThrow(
        "Erro ao buscar dados da conta",
      );
    });

    it("should throw HttpException for network errors", async () => {
      const userId = 1;
      const mockError = new Error("Network error");

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getAccountDetails(userId)).rejects.toThrow(
        HttpException,
      );
      await expect(service.getAccountDetails(userId)).rejects.toThrow(
        "Erro ao buscar dados da conta",
      );
    });
  });

  describe("getAccountBalance", () => {
    it("should return account balance successfully", async () => {
      const accountId = 1;
      const mockBalanceResponse = {
        accountId: 1,
        balance: 5000.0,
        currency: "BRL",
        lastUpdate: "2024-01-01T00:00:00.000Z",
      };

      const mockResponse = {
        data: mockBalanceResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getAccountBalance(accountId);

      expect(result).toEqual(mockBalanceResponse);
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/accounts/1/balance"),
      );
    });

    it("should throw HttpException when account not found for balance", async () => {
      const accountId = 999;
      const mockError = {
        response: {
          status: 404,
          data: "Account not found",
        },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getAccountBalance(accountId)).rejects.toThrow(
        HttpException,
      );
      await expect(service.getAccountBalance(accountId)).rejects.toThrow(
        "Conta não encontrada",
      );
    });

    it("should throw HttpException for other balance errors", async () => {
      const accountId = 1;
      const mockError = {
        response: {
          status: 500,
          data: "Internal server error",
        },
      };

      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.getAccountBalance(accountId)).rejects.toThrow(
        HttpException,
      );
      await expect(service.getAccountBalance(accountId)).rejects.toThrow(
        "Erro ao buscar saldo da conta",
      );
    });
  });

  describe("getTransferServiceUrl", () => {
    it("should return default URL when TRANSFER_SERVICE_URL is not set", () => {
      const originalEnv = process.env.TRANSFER_SERVICE_URL;
      delete process.env.TRANSFER_SERVICE_URL;

      // Access private method through service instance
      const serviceInstance = service as any;
      const url = serviceInstance.getTransferServiceUrl();

      expect(url).toBe("http://transfer-service:3001");

      // Restore environment variable
      if (originalEnv) {
        process.env.TRANSFER_SERVICE_URL = originalEnv;
      }
    });

    it("should return custom URL when TRANSFER_SERVICE_URL is set", () => {
      const originalEnv = process.env.TRANSFER_SERVICE_URL;
      process.env.TRANSFER_SERVICE_URL = "http://custom-transfer-service:3002";

      // Access private method through service instance
      const serviceInstance = service as any;
      const url = serviceInstance.getTransferServiceUrl();

      expect(url).toBe("http://custom-transfer-service:3002");

      // Restore environment variable
      if (originalEnv) {
        process.env.TRANSFER_SERVICE_URL = originalEnv;
      } else {
        delete process.env.TRANSFER_SERVICE_URL;
      }
    });
  });
});
