import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "../entities/client.entity";

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
  ) {}

  async findById(id: number): Promise<Client | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    return this.repository.findOne({ where: { cpf } });
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(clientData: Partial<Client>): Promise<Client> {
    const client = this.repository.create(clientData);
    return this.repository.save(client);
  }

  async update(id: number, updateData: Partial<Client>): Promise<Client> {
    await this.repository.update(id, updateData);
    const updatedClient = await this.findById(id);
    if (!updatedClient) {
      throw new Error("Cliente não encontrado após atualização");
    }
    return updatedClient;
  }

  async delete(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new Error("Cliente não encontrado para exclusão");
    }
  }

  async findAll(): Promise<Client[]> {
    return this.repository.find();
  }
}
