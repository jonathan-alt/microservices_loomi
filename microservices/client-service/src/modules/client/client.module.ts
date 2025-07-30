import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { UserRepository } from "./repositories/user.repository";
import { TransferClientService } from "./services/transfer-client.service";
import { User } from "./entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  controllers: [ClientController],
  providers: [ClientService, UserRepository, TransferClientService],
  exports: [ClientService, UserRepository],
})
export class ClientModule {}
