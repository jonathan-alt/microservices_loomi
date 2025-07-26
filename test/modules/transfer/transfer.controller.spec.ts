import { Test, TestingModule } from "@nestjs/testing";
import { TransferController } from "../../../src/modules/transfer/transfer.controller";
import { TransferService } from "../../../src/modules/transfer/transfer.service";

describe("TransferController", () => {
  let controller: TransferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        {
          provide: TransferService,
          useValue: {
            getHello: jest.fn().mockReturnValue("Transfer Service is running!"),
          },
        },
      ],
    }).compile();

    controller = module.get<TransferController>(TransferController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getHello", () => {
    it("should return hello message", () => {
      expect(controller.getHello()).toBe("Transfer Service is running!");
    });
  });
});
