import { Module } from "@nestjs/common";
import { MessagingService } from "./messaging.service";

@Module({
  providers: [MessagingService] as any,
  exports: [MessagingService] as any,
})
export class MessagingModule {}
