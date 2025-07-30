import { Test, TestingModule } from "@nestjs/testing";
import { HistoryTransferController } from "./history_transfer.controller";
import { HistoryTransferService } from "./history_transfer.service";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { HistoryTransfer } from "./entities/history-transfer.entity";

describe("HistoryTransferController", () => {
  let controller: HistoryTransferController;
  let historyTransferService: jest.Mocked<HistoryTransferService>;

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
    const mockHistoryTransferService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByAccountId: jest.fn(),
      findByTargetAccountId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryTransferController],
      providers: [
        {
          provide: HistoryTransferService,
          useValue: mockHistoryTransferService,
        },
      ],
    }).compile();

    controller = module.get<HistoryTransferController>(
      HistoryTransferController,
    );
    historyTransferService = module.get(HistoryTransferService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create history transfer", async () => {
      historyTransferService.create.mockResolvedValue(mockHistoryTransfer);

      const result = await controller.create(mockCreateHistoryDto);

      expect(result).toEqual(mockHistoryTransfer);
      expect(historyTransferService.create).toHaveBeenCalledWith(
        mockCreateHistoryDto,
      );
    });
  });

  describe("findAll", () => {
    it("should return all history transfers", async () => {
      const mockHistoryTransfers = [mockHistoryTransfer];
      historyTransferService.findAll.mockResolvedValue(mockHistoryTransfers);

      const result = await controller.findAll();

      expect(result).toEqual(mockHistoryTransfers);
      expect(historyTransferService.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return history transfer by id", async () => {
      historyTransferService.findById.mockResolvedValue(mockHistoryTransfer);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockHistoryTransfer);
      expect(historyTransferService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe("findByAccountId", () => {
    it("should return history transfers by account id", async () => {
      const mockHistoryTransfers = [mockHistoryTransfer];
      historyTransferService.findByAccountId.mockResolvedValue(
        mockHistoryTransfers,
      );

      const result = await controller.findByAccountId(1);

      expect(result).toEqual(mockHistoryTransfers);
      expect(historyTransferService.findByAccountId).toHaveBeenCalledWith(1);
    });
  });

  describe("update", () => {
    it("should update history transfer", async () => {
      const updatedHistoryTransfer = {
        ...mockHistoryTransfer,
        description: "Updated description",
      };
      historyTransferService.update.mockResolvedValue(updatedHistoryTransfer);

      const result = await controller.update(1, mockUpdateHistoryDto);

      expect(result).toEqual(updatedHistoryTransfer);
      expect(historyTransferService.update).toHaveBeenCalledWith(
        1,
        mockUpdateHistoryDto,
      );
    });
  });

  describe("remove", () => {
    it("should delete history transfer", async () => {
      historyTransferService.delete.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(historyTransferService.delete).toHaveBeenCalledWith(1);
    });
  });
});
