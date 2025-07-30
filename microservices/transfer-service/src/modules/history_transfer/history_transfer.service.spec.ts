import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { HistoryTransferService } from "./history_transfer.service";
import { HistoryTransferRepository } from "./repositories/history_transfer.repository";
import { MessagingService } from "../messaging/messaging.service";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { HistoryTransfer } from "./entities/history-transfer.entity";
import { TransferCreatedEvent } from "../../shared/events/transfer.events";

describe("HistoryTransferService", () => {
  let service: HistoryTransferService;
  let historyTransferRepository: jest.Mocked<HistoryTransferRepository>;
  let messagingService: jest.Mocked<MessagingService>;

  const mockHistoryTransfer: HistoryTransfer = {
    id: 1,
    account_id: 1,
    transfer_value: 100,
    target_id_account: 2,
    description: "Test transfer",
    new_value: 900,
    old_value: 1000,
    type: "TRANSFER-SENT",
    timestamp: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCreateHistoryDto: CreateHistoryDto = {
    account_id: 1,
    transfer_value: 100,
    target_id_account: 2,
    description: "Test transfer",
    new_value: 900,
    old_value: 1000,
    type: "TRANSFER-SENT",
    timestamp: new Date().toISOString(),
  };

  const mockUpdateHistoryDto: UpdateHistoryDto = {
    description: "Updated transfer description",
  };

  beforeEach(async () => {
    const mockHistoryTransferRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByAccountId: jest.fn(),
      findByTargetAccountId: jest.fn(),
    };

    const mockMessagingService = {
      publishTransferCreated: jest.fn(),
      publishTransferCompleted: jest.fn(),
      publishTransferFailed: jest.fn(),
      publishAccountBalanceUpdated: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryTransferService,
        {
          provide: HistoryTransferRepository,
          useValue: mockHistoryTransferRepository,
        },
        {
          provide: MessagingService,
          useValue: mockMessagingService,
        },
      ],
    }).compile();

    service = module.get<HistoryTransferService>(HistoryTransferService);
    historyTransferRepository = module.get(HistoryTransferRepository);
    messagingService = module.get(MessagingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create history transfer successfully", async () => {
      historyTransferRepository.create.mockResolvedValue(mockHistoryTransfer);

      const result = await service.create(mockCreateHistoryDto);

      expect(result).toEqual(mockHistoryTransfer);
      expect(historyTransferRepository.create).toHaveBeenCalledWith(
        mockCreateHistoryDto,
      );
      expect(messagingService.publishTransferCreated).toHaveBeenCalledWith(
        expect.any(TransferCreatedEvent),
      );
    });

    it("should not publish event when history transfer has no id", async () => {
      const historyWithoutId = { ...mockHistoryTransfer, id: undefined } as any;
      historyTransferRepository.create.mockResolvedValue(historyWithoutId);

      await service.create(mockCreateHistoryDto);

      expect(messagingService.publishTransferCreated).not.toHaveBeenCalled();
    });

    it("should not publish event when account_id is missing", async () => {
      const historyWithoutAccountId = {
        ...mockHistoryTransfer,
        account_id: undefined,
      } as any;
      historyTransferRepository.create.mockResolvedValue(
        historyWithoutAccountId,
      );

      await service.create(mockCreateHistoryDto);

      expect(messagingService.publishTransferCreated).not.toHaveBeenCalled();
    });

    it("should not publish event when target_id_account is missing", async () => {
      const historyWithoutTargetId = {
        ...mockHistoryTransfer,
        target_id_account: undefined,
      } as any;
      historyTransferRepository.create.mockResolvedValue(
        historyWithoutTargetId,
      );

      await service.create(mockCreateHistoryDto);

      expect(messagingService.publishTransferCreated).not.toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("should return all history transfers", async () => {
      const mockHistoryTransfers = [mockHistoryTransfer];
      historyTransferRepository.findAll.mockResolvedValue(mockHistoryTransfers);

      const result = await service.findAll();

      expect(result).toEqual(mockHistoryTransfers);
      expect(historyTransferRepository.findAll).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return history transfer by id", async () => {
      historyTransferRepository.findById.mockResolvedValue(mockHistoryTransfer);

      const result = await service.findById(1);

      expect(result).toEqual(mockHistoryTransfer);
      expect(historyTransferRepository.findById).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException when history transfer not found", async () => {
      historyTransferRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      expect(historyTransferRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe("update", () => {
    it("should update history transfer successfully", async () => {
      const updatedHistoryTransfer = {
        ...mockHistoryTransfer,
        description: "Updated description",
      };
      historyTransferRepository.update.mockResolvedValue(
        updatedHistoryTransfer,
      );

      const result = await service.update(1, mockUpdateHistoryDto);

      expect(result).toEqual(updatedHistoryTransfer);
      expect(historyTransferRepository.update).toHaveBeenCalledWith(
        1,
        mockUpdateHistoryDto,
      );
    });

    it("should throw NotFoundException when history transfer not found for update", async () => {
      historyTransferRepository.update.mockResolvedValue(null);

      await expect(service.update(999, mockUpdateHistoryDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(historyTransferRepository.update).toHaveBeenCalledWith(
        999,
        mockUpdateHistoryDto,
      );
    });
  });

  describe("delete", () => {
    it("should delete history transfer successfully", async () => {
      historyTransferRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(historyTransferRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException when history transfer not found for deletion", async () => {
      historyTransferRepository.delete.mockResolvedValue(false);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(historyTransferRepository.delete).toHaveBeenCalledWith(999);
    });
  });

  describe("findByAccountId", () => {
    it("should return history transfers by account id", async () => {
      const mockHistoryTransfers = [mockHistoryTransfer];
      historyTransferRepository.findByAccountId.mockResolvedValue(
        mockHistoryTransfers,
      );

      const result = await service.findByAccountId(1);

      expect(result).toEqual(mockHistoryTransfers);
      expect(historyTransferRepository.findByAccountId).toHaveBeenCalledWith(1);
    });
  });

  describe("findByTargetAccountId", () => {
    it("should return history transfers by target account id", async () => {
      const mockHistoryTransfers = [mockHistoryTransfer];
      historyTransferRepository.findByTargetAccountId.mockResolvedValue(
        mockHistoryTransfers,
      );

      const result = await service.findByTargetAccountId(2);

      expect(result).toEqual(mockHistoryTransfers);
      expect(
        historyTransferRepository.findByTargetAccountId,
      ).toHaveBeenCalledWith(2);
    });
  });
});
