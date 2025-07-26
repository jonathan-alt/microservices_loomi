import { Test, TestingModule } from "@nestjs/testing";
import { TransferService } from "../../../src/modules/transfer/transfer.service";

describe("TransferService", () => {
  let service: TransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferService],
    }).compile();

    service = module.get<TransferService>(TransferService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getHello", () => {
    it("should return hello message", () => {
      expect(service.getHello()).toBe("Transfer Service is running!");
    });
  });
});
