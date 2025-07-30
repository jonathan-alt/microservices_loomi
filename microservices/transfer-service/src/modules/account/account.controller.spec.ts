import { Test, TestingModule } from "@nestjs/testing";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Account } from "./entities/account.entity";

describe("AccountController", () => {
  let controller: AccountController;
  let accountService: jest.Mocked<AccountService>;

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
    const mockAccountService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByClientId: jest.fn(),
      transfer: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    accountService = module.get(AccountService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create an account", async () => {
      accountService.create.mockResolvedValue(mockAccount);

      const result = await controller.create(mockCreateAccountDto);

      expect(result).toEqual(mockAccount);
      expect(accountService.create).toHaveBeenCalledWith(mockCreateAccountDto);
    });
  });

  describe("findAll", () => {
    it("should return all accounts", async () => {
      const mockAccounts = [mockAccount];
      accountService.findAll.mockResolvedValue(mockAccounts);

      const result = await controller.findAll();

      expect(result).toEqual(mockAccounts);
      expect(accountService.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return account by id", async () => {
      accountService.findById.mockResolvedValue(mockAccount);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockAccount);
      expect(accountService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe("findByClientId", () => {
    it("should return account by client id", async () => {
      accountService.findByClientId.mockResolvedValue(mockAccount);

      const result = await controller.findByClientId(123);

      expect(result).toEqual(mockAccount);
      expect(accountService.findByClientId).toHaveBeenCalledWith(123);
    });
  });

  describe("update", () => {
    it("should update account", async () => {
      const updatedAccount = { ...mockAccount, value: 1500 };
      accountService.update.mockResolvedValue(updatedAccount);

      const result = await controller.update(1, mockUpdateAccountDto);

      expect(result).toEqual(updatedAccount);
      expect(accountService.update).toHaveBeenCalledWith(
        1,
        mockUpdateAccountDto,
      );
    });
  });

  describe("remove", () => {
    it("should delete account", async () => {
      accountService.delete.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(accountService.delete).toHaveBeenCalledWith(1);
    });
  });

  describe("transfer", () => {
    it("should perform transfer", async () => {
      accountService.transfer.mockResolvedValue(mockAccount);

      const result = await controller.transfer(mockCreateTransactionDto);

      expect(result).toEqual(mockAccount);
      expect(accountService.transfer).toHaveBeenCalledWith(
        mockCreateTransactionDto,
      );
    });
  });
});
