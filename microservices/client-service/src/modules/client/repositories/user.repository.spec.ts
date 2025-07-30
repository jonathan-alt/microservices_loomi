import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRepository } from "./user.repository";
import { User } from "../entities/user.entity";

describe("UserRepository", () => {
  let repository: UserRepository;
  let typeOrmRepository: Repository<User>;

  const mockUser = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    phone: "(11) 99999-9999",
    picture: "https://example.com/joao.jpg",
    address: "Rua das Flores, 123 - São Paulo, SP",
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
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    typeOrmRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should return user by id", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findById(1);

      expect(result).toEqual(mockUser);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return null when user not found", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("findByCpf", () => {
    it("should return user by cpf", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findByCpf("123.456.789-00");

      expect(result).toEqual(mockUser);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: "123.456.789-00" },
      });
    });

    it("should return null when user not found", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByCpf("999.999.999-99");

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should return user by email", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findByEmail("joao@email.com");

      expect(result).toEqual(mockUser);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: "joao@email.com" },
      });
    });

    it("should return null when user not found", async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail("nonexistent@email.com");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create and return new user", async () => {
      const userData = {
        name: "Maria Santos",
        email: "maria@email.com",
        cpf: "987.654.321-00",
      };

      const newUser = { ...mockUser, ...userData, id: 2 };
      mockTypeOrmRepository.create.mockReturnValue(newUser);
      mockTypeOrmRepository.save.mockResolvedValue(newUser);

      const result = await repository.create(userData);

      expect(result).toEqual(newUser);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(userData);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe("update", () => {
    it("should update and return user", async () => {
      const updateData = { name: "João Silva Updated" };
      const updatedUser = { ...mockUser, ...updateData };

      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 });
      mockTypeOrmRepository.findOne.mockResolvedValue(updatedUser);

      const result = await repository.update(1, updateData);

      expect(result).toEqual(updatedUser);
      expect(typeOrmRepository.update).toHaveBeenCalledWith(1, updateData);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw error when user not found after update", async () => {
      const updateData = { name: "João Silva Updated" };

      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 });
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update(999, updateData)).rejects.toThrow(
        "Usuário não encontrado após atualização",
      );
    });
  });

  describe("delete", () => {
    it("should delete user successfully", async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 });

      await repository.delete(1);

      expect(typeOrmRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should throw error when user not found for deletion", async () => {
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(repository.delete(999)).rejects.toThrow(
        "Usuário não encontrado para exclusão",
      );
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      const users = [mockUser, { ...mockUser, id: 2, name: "Maria Santos" }];
      mockTypeOrmRepository.find.mockResolvedValue(users);

      const result = await repository.findAll();

      expect(result).toEqual(users);
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });
  });
});
