import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "../entities/client.entity";

describe("ClientRepository", () => {
  let typeOrmRepository: Repository<Client>;

  const mockClient: Client = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    phone: "(11) 99999-9999",
    picture: "https://example.com/joao.jpg",

    agency: "0001",
    account_number: "123456-7",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockTypeOrmRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Client),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    typeOrmRepository = module.get<Repository<Client>>(
      getRepositoryToken(Client),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should return client when found", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockClient);

      const result = await typeOrmRepository.findOne({ where: { id: 1 } });

      expect(result).toEqual(mockClient);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return null when client not found", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await typeOrmRepository.findOne({ where: { id: 999 } });

      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe("findByCpf", () => {
    it("should return client when found by CPF", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockClient);

      const result = await typeOrmRepository.findOne({
        where: { cpf: "123.456.789-00" },
      });

      expect(result).toEqual(mockClient);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: "123.456.789-00" },
      });
    });

    it("should return null when client not found by CPF", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await typeOrmRepository.findOne({
        where: { cpf: "999.999.999-99" },
      });

      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: "999.999.999-99" },
      });
    });
  });

  describe("findByEmail", () => {
    it("should return client when found by email", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockClient);

      const result = await typeOrmRepository.findOne({
        where: { email: "joao@email.com" },
      });

      expect(result).toEqual(mockClient);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: "joao@email.com" },
      });
    });

    it("should return null when client not found by email", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await typeOrmRepository.findOne({
        where: { email: "inexistente@email.com" },
      });

      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: "inexistente@email.com" },
      });
    });
  });

  describe("create", () => {
    it("should create and return new client", async () => {
      const newClientData = {
        name: "Maria Santos",
        email: "maria@email.com",
        cpf: "987.654.321-00",
        phone: "(11) 88888-8888",
        picture: "https://example.com/maria.jpg",

        agency: "0002",
        account_number: "987654-3",
      };

      const createdClient = { ...mockClient, ...newClientData, id: 2 };
      mockTypeOrmRepository.create.mockReturnValue(createdClient);
      mockTypeOrmRepository.save.mockResolvedValue(createdClient);

      const result = await typeOrmRepository.save(
        typeOrmRepository.create(newClientData),
      );

      expect(result).toEqual(createdClient);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(newClientData);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(createdClient);
    });
  });

  describe("update", () => {
    it("should update client successfully", async () => {
      const updateData = {
        name: "João Silva Atualizado",
        email: "joao.novo@email.com",
      };

      const updatedClient = { ...mockClient, ...updateData };
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 });
      mockTypeOrmRepository.findOne.mockResolvedValue(updatedClient);

      await typeOrmRepository.update(1, updateData);
      const result = await typeOrmRepository.findOne({ where: { id: 1 } });

      expect(result).toEqual(updatedClient);
      expect(typeOrmRepository.update).toHaveBeenCalledWith(1, updateData);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe("delete", () => {
    it("should delete client successfully", async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 });

      await typeOrmRepository.delete(1);

      expect(typeOrmRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe("findAll", () => {
    it("should return all clients", async () => {
      const clients = [
        mockClient,
        { ...mockClient, id: 2, name: "Maria Santos" },
      ];
      mockTypeOrmRepository.find.mockResolvedValue(clients);

      const result = await typeOrmRepository.find();

      expect(result).toEqual(clients);
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });

    it("should return empty array when no clients found", async () => {
      mockTypeOrmRepository.find.mockResolvedValue([]);

      const result = await typeOrmRepository.find();

      expect(result).toEqual([]);
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });
  });
});
