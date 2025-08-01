import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { ClientRepository } from "./repositories/client.repository";
import { TransferClientService } from "./services";
import { Client } from "./entities/client.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Client]), HttpModule],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository, TransferClientService],
  exports: [ClientService, ClientRepository, TransferClientService],
})
export class ClientModule {}
