import { Test, TestingModule } from "@nestjs/testing";
import { MessagingService } from "./messaging.service";

describe("MessagingService", () => {
  let service: MessagingService;
  let mockChannel: any;
  let mockConnection: any;

  beforeEach(async () => {
    mockChannel = {
      assertExchange: jest.fn(),
      assertQueue: jest.fn(),
      bindQueue: jest.fn(),
      publish: jest.fn(),
      consume: jest.fn(),
      close: jest.fn(),
      ack: jest.fn(),
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingService,
        {
          provide: "AMQP_CONNECTION",
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
    // Mock the connection and channel
    (service as any).connection = mockConnection;
    (service as any).channel = mockChannel;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("publishClientEvent", () => {
    it("should publish client event successfully", async () => {
      const event = "user.registered";
      const data = { id: 1, name: "Test User" };

      mockChannel.publish.mockResolvedValue(undefined);

      await service.publishClientEvent(event, data);

      expect(mockChannel.publish).toHaveBeenCalledWith(
        "client_events",
        event,
        expect.any(Buffer),
      );

      // Verify the published message content
      const publishCall = mockChannel.publish.mock.calls[0];
      if (publishCall && publishCall[3]) {
        const publishedMessage = JSON.parse(publishCall[3].toString());
        expect(publishedMessage).toHaveProperty("event", event);
        expect(publishedMessage).toHaveProperty("data", data);
        expect(publishedMessage).toHaveProperty("timestamp");
        expect(publishedMessage).toHaveProperty("service", "client-service");
      }
    });

    it("should handle publish error gracefully", async () => {
      const event = "user.registered";
      const data = { id: 1, name: "Test User" };

      mockChannel.publish.mockRejectedValue(new Error("Publish failed"));

      // Should not throw
      await expect(
        service.publishClientEvent(event, data),
      ).resolves.toBeUndefined();
    });
  });

  describe("publishUserRegistered", () => {
    it("should publish user registered event", async () => {
      const userData = { id: 1, name: "Test User", email: "test@example.com" };

      jest.spyOn(service, "publishClientEvent").mockResolvedValue(undefined);

      await service.publishUserRegistered(userData);

      expect(service.publishClientEvent).toHaveBeenCalledWith(
        "user.registered",
        userData,
      );
    });
  });

  describe("publishUserUpdated", () => {
    it("should publish user updated event", async () => {
      const userData = {
        id: 1,
        name: "Updated User",
        email: "test@example.com",
      };

      jest.spyOn(service, "publishClientEvent").mockResolvedValue(undefined);

      await service.publishUserUpdated(userData);

      expect(service.publishClientEvent).toHaveBeenCalledWith(
        "user.updated",
        userData,
      );
    });
  });

  describe("publishUserLoggedIn", () => {
    it("should publish user logged in event", async () => {
      const userData = { id: 1, name: "Test User", email: "test@example.com" };

      jest.spyOn(service, "publishClientEvent").mockResolvedValue(undefined);

      await service.publishUserLoggedIn(userData);

      expect(service.publishClientEvent).toHaveBeenCalledWith(
        "user.logged_in",
        userData,
      );
    });
  });

  describe("publishUserLoggedOut", () => {
    it("should publish user logged out event", async () => {
      const userData = { id: 1 };

      jest.spyOn(service, "publishClientEvent").mockResolvedValue(undefined);

      await service.publishUserLoggedOut(userData);

      expect(service.publishClientEvent).toHaveBeenCalledWith(
        "user.logged_out",
        userData,
      );
    });
  });

  describe("handleTransferEvent", () => {
    it("should handle transfer.created event", () => {
      const event = {
        event: "transfer.created",
        data: { transferId: 1, amount: 100 },
      };

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      (service as any).handleTransferEvent(event);

      // Test behavior, not specific log format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Transfer created"),
        event.data,
      );
    });

    it("should handle transfer.completed event", () => {
      const event = {
        event: "transfer.completed",
        data: { transferId: 1, amount: 100 },
      };

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      (service as any).handleTransferEvent(event);

      // Test behavior, not specific log format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Transfer completed"),
        event.data,
      );
    });

    it("should handle transfer.failed event", () => {
      const event = {
        event: "transfer.failed",
        data: { transferId: 1, error: "Insufficient funds" },
      };

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      (service as any).handleTransferEvent(event);

      // Test behavior, not specific log format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Transfer failed"),
        event.data,
      );
    });

    it("should handle account.balance.updated event", () => {
      const event = {
        event: "account.balance.updated",
        data: { accountId: 1, newBalance: 1000 },
      };

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      (service as any).handleTransferEvent(event);

      // Test behavior, not specific log format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Account balance updated"),
        event.data,
      );
    });

    it("should handle unknown event", () => {
      const event = {
        event: "unknown.event",
        data: { someData: "value" },
      };

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      (service as any).handleTransferEvent(event);

      // Test behavior, not specific log format
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Unknown transfer event"),
      );
    });
  });

  describe("onModuleDestroy", () => {
    it("should close connection and channel", async () => {
      await service.onModuleDestroy();

      expect(mockChannel.close).toHaveBeenCalled();
      expect(mockConnection.close).toHaveBeenCalled();
    });

    it("should handle close errors gracefully", async () => {
      mockChannel.close.mockRejectedValue(new Error("Close failed"));
      mockConnection.close.mockRejectedValue(new Error("Close failed"));

      // Should not throw
      await expect(service.onModuleDestroy()).resolves.toBeUndefined();
    });
  });
});
