import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";

import { rabbitmqConfig } from "../../config/rabbitmq.config";

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private connection: any;

  private channel: any;

  async onModuleInit() {
    console.log("🔄 Initializing Transfer MessagingService...");
    await this.connect();
    await this.consumeClientEvents();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect({
        hostname: rabbitmqConfig.host,
        port: rabbitmqConfig.port,
        username: rabbitmqConfig.username,
        password: rabbitmqConfig.password,
      });

      this.channel = await this.connection.createChannel();
      console.log("✅ Transfer Service - RabbitMQ connected successfully");

      // Declarar exchanges
      await this.channel.assertExchange("client_events", "topic", {
        durable: true,
      });
      await this.channel.assertExchange("transfer_events", "topic", {
        durable: true,
      });

      // Declarar filas
      await this.channel.assertQueue("client_service_queue", { durable: true });
      await this.channel.assertQueue("transfer_service_queue", {
        durable: true,
      });

      // Bindings
      await this.channel.bindQueue(
        "client_service_queue",
        "client_events",
        "#",
      );
      await this.channel.bindQueue(
        "transfer_service_queue",
        "transfer_events",
        "#",
      );

      console.log(
        "✅ Transfer Service - RabbitMQ exchanges and queues configured",
      );
    } catch (error) {
      console.error("❌ Transfer Service - RabbitMQ connection failed:", error);
    }
  }

  private async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log("✅ Transfer Service - RabbitMQ disconnected");
    } catch (error) {
      console.error(
        "❌ Transfer Service - Error disconnecting RabbitMQ:",
        error,
      );
    }
  }

  // Publicar eventos do transfer-service
  async publishTransferEvent(event: string, data: any) {
    try {
      const message = JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString(),
        service: "transfer-service",
      });

      await this.channel.publish(
        "transfer_events",
        event,
        Buffer.from(message),
      );
      console.log(`📤 Transfer Service - Published transfer event: ${event}`);
    } catch (error) {
      console.error(
        `❌ Transfer Service - Error publishing transfer event ${event}:`,
        error,
      );
    }
  }

  // Consumir eventos do client-service
  async consumeClientEvents() {
    try {
      await this.channel.consume("transfer_service_queue", (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());
          console.log(
            `📥 Transfer Service - Received client event: ${content.event}`,
          );

          this.handleClientEvent(content);
          this.channel.ack(msg);
        }
      });

      console.log("✅ Transfer Service - Listening for client events");
    } catch (error) {
      console.error(
        "❌ Transfer Service - Error consuming client events:",
        error,
      );
    }
  }

  private handleClientEvent(event: any) {
    switch (event.event) {
      case "user.registered":
        this.handleUserRegistered(event.data);
        break;
      case "user.updated":
        this.handleUserUpdated(event.data);
        break;
      case "user.logged_in":
        this.handleUserLoggedIn(event.data);
        break;
      case "user.logged_out":
        this.handleUserLoggedOut(event.data);
        break;
      default:
        console.log(
          `⚠️ Transfer Service - Unknown client event: ${event.event}`,
        );
    }
  }

  private handleUserRegistered(data: any) {
    console.log("👤 Transfer Service - User registered:", data);
    // Aqui você pode implementar lógica específica
    // Por exemplo, criar conta bancária automaticamente
  }

  private handleUserUpdated(data: any) {
    console.log("✏️ Transfer Service - User updated:", data);
    // Atualizar dados do usuário no sistema de transferências
  }

  private handleUserLoggedIn(data: any) {
    console.log("🔐 Transfer Service - User logged in:", data);
    // Registrar atividade do usuário
  }

  private handleUserLoggedOut(data: any) {
    console.log("🚪 Transfer Service - User logged out:", data);
    // Limpar dados temporários do usuário
  }

  // Eventos específicos do transfer-service
  async publishTransferCreated(transferData: any) {
    await this.publishTransferEvent("transfer.created", transferData);
  }

  async publishTransferCompleted(transferData: any) {
    await this.publishTransferEvent("transfer.completed", transferData);
  }

  async publishTransferFailed(transferData: any) {
    await this.publishTransferEvent("transfer.failed", transferData);
  }

  async publishAccountBalanceUpdated(accountData: any) {
    await this.publishTransferEvent("account.balance.updated", accountData);
  }
}
