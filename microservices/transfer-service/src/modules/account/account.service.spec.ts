import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountRepository } from "./repositories/account.repository";
import { MessagingService } from "../messaging/messaging.service";
import { HistoryTransferService } from "../history_transfer/history_transfer.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Account } from "./entities/account.entity";
import { AccountBalanceUpdatedEvent } from "../../shared/events/transfer.events";

describe("AccountService", () => {
  let service: AccountService;
  let accountRepository: jest.Mocked<AccountRepository>;
  let messagingService: jest.Mocked<MessagingService>;
  let historyTransferService: jest.Mocked<HistoryTransferService>;

  const mockAccount: Account = {
    id: 1,
    client_id: 123,
    value: 1000,
    history_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCreateAccountDto: CreateAccountDto = {
    client_id: 123,
    value: 1000,
    history_id: 1,
  };

  const mockUpdateAccountDto: UpdateAccountDto = {
    value: 1500,
  };

  const mockCreateTransactionDto: CreateTransactionDto = {
    senderUserId: 123,
    receiverUserId: 456,
    amount: 100,
    description: "Test transfer",
  };

  beforeEach(async () => {
    const mockAccountRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByClientId: jest.fn(),
    };

    const mockMessagingService = {
      publishAccountBalanceUpdated: jest.fn(),
      publishTransferCreated: jest.fn(),
      publishTransferCompleted: jest.fn(),
      publishTransferFailed: jest.fn(),
    };

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
      providers: [
        AccountService,
        {
          provide: AccountRepository,
          useValue: mockAccountRepository,
        },
        {
          provide: MessagingService,
          useValue: mockMessagingService,
        },
        {
          provide: HistoryTransferService,
          useValue: mockHistoryTransferService,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    accountRepository = module.get(AccountRepository);
    messagingService = module.get(MessagingService);
    historyTransferService = module.get(HistoryTransferService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create an account successfully", async () => {
      accountRepository.findByClientId.mockResolvedValue(null);
      accountRepository.create.mockResolvedValue(mockAccount);

      const result = await service.create(mockCreateAccountDto);

      expect(result).toEqual(mockAccount);
      expect(accountRepository.findByClientId).toHaveBeenCalledWith(
        mockCreateAccountDto.client_id,
      );
      expect(accountRepository.create).toHaveBeenCalledWith(
        mockCreateAccountDto,
      );
    });

    it("should throw BadRequestException when account already exists for client", async () => {
      accountRepository.findByClientId.mockResolvedValue(mockAccount);

      await expect(service.create(mockCreateAccountDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(accountRepository.findByClientId).toHaveBeenCalledWith(
        mockCreateAccountDto.client_id,
      );
    });
  });

  describe("findAll", () => {
    it("should return all accounts", async () => {
      const mockAccounts = [mockAccount];
      accountRepository.findAll.mockResolvedValue(mockAccounts);

      const result = await service.findAll();

      expect(result).toEqual(mockAccounts);
      expect(accountRepository.findAll).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return account by id", async () => {
      accountRepository.findById.mockResolvedValue(mockAccount);

      const result = await service.findById(1);

      expect(result).toEqual(mockAccount);
      expect(accountRepository.findById).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException when account not found", async () => {
      accountRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      expect(accountRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe("update", () => {
    it("should update account successfully", async () => {
      const updatedAccount = { ...mockAccount, value: 1500 };
      accountRepository.findById.mockResolvedValue(mockAccount);
      accountRepository.update.mockResolvedValue(updatedAccount);

      const result = await service.update(1, mockUpdateAccountDto);

      expect(result).toEqual(updatedAccount);
      expect(accountRepository.findById).toHaveBeenCalledWith(1);
      expect(accountRepository.update).toHaveBeenCalledWith(
        1,
        mockUpdateAccountDto,
      );
      expect(
        messagingService.publishAccountBalanceUpdated,
      ).toHaveBeenCalledWith(expect.any(AccountBalanceUpdatedEvent));
    });

    it("should throw NotFoundException when account not found for update", async () => {
      accountRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, mockUpdateAccountDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(accountRepository.findById).toHaveBeenCalledWith(999);
    });

    it("should throw NotFoundException when update returns null", async () => {
      accountRepository.findById.mockResolvedValue(mockAccount);
      accountRepository.update.mockResolvedValue(null);

      await expect(service.update(1, mockUpdateAccountDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("delete", () => {
    it("should delete account successfully", async () => {
      accountRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(accountRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException when account not found for deletion", async () => {
      accountRepository.delete.mockResolvedValue(false);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(accountRepository.delete).toHaveBeenCalledWith(999);
    });
  });

  describe("findByClientId", () => {
    it("should return account by client id", async () => {
      accountRepository.findByClientId.mockResolvedValue(mockAccount);

      const result = await service.findByClientId(123);

      expect(result).toEqual(mockAccount);
      expect(accountRepository.findByClientId).toHaveBeenCalledWith(123);
    });

    it("should return null when account not found for client", async () => {
      accountRepository.findByClientId.mockResolvedValue(null);

      const result = await service.findByClientId(999);

      expect(result).toBeNull();
      expect(accountRepository.findByClientId).toHaveBeenCalledWith(999);
    });
  });

  describe("transfer", () => {
    const senderAccount = {
      ...mockAccount,
      id: 1,
      client_id: 123,
      value: 1000,
    };
    const receiverAccount = {
      ...mockAccount,
      id: 2,
      client_id: 456,
      value: 500,
    };

    beforeEach(() => {
      jest
        .spyOn(service, "findByClientId")
        .mockImplementation((clientId: number) => {
          if (clientId === 123) return Promise.resolve(senderAccount);
          if (clientId === 456) return Promise.resolve(receiverAccount);
          return Promise.resolve(null);
        });
      jest.spyOn(service, "update").mockResolvedValue(senderAccount);
      jest.spyOn(service, "findById").mockResolvedValue(senderAccount);
      historyTransferService.create.mockResolvedValue({} as any);
    });

    it("should perform transfer successfully", async () => {
      const result = await service.transfer(mockCreateTransactionDto);

      expect(result).toEqual(senderAccount);
      expect(service.findByClientId).toHaveBeenCalledWith(123);
      expect(service.findByClientId).toHaveBeenCalledWith(456);
      expect(service.update).toHaveBeenCalledWith(1, { value: 900 });
      expect(service.update).toHaveBeenCalledWith(2, { value: 600 });
      expect(historyTransferService.create).toHaveBeenCalledWith({
        account_id: 1,
        transfer_value: 100,
        target_id_account: 2,
        description: "Test transfer",
        new_value: 900,
        old_value: 1000,
        type: "TRANSFER-SENT",
        timestamp: expect.any(String),
      });
    });

    it("should throw BadRequestException when sender and receiver are the same", async () => {
      const invalidDto = { ...mockCreateTransactionDto, receiverUserId: 123 };

      await expect(service.transfer(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should throw BadRequestException when amount is zero or negative", async () => {
      const invalidDto = { ...mockCreateTransactionDto, amount: 0 };

      await expect(service.transfer(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should throw NotFoundException when sender account not found", async () => {
      jest.spyOn(service, "findByClientId").mockResolvedValue(null);

      await expect(service.transfer(mockCreateTransactionDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw NotFoundException when receiver account not found", async () => {
      jest
        .spyOn(service, "findByClientId")
        .mockResolvedValueOnce(senderAccount)
        .mockResolvedValueOnce(null);

      await expect(service.transfer(mockCreateTransactionDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw BadRequestException when insufficient balance", async () => {
      const insufficientDto = { ...mockCreateTransactionDto, amount: 1500 };

      await expect(service.transfer(insufficientDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should use default description when not provided", async () => {
      const dtoWithoutDescription = { ...mockCreateTransactionDto };
      delete dtoWithoutDescription.description;

      await service.transfer(dtoWithoutDescription);

      expect(historyTransferService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Transferência entre usuários",
        }),
      );
    });
  });
});
