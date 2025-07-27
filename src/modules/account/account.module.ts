import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { AccountRepository } from "./repositories/account.repository";
import { Account } from "./entities/account.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
