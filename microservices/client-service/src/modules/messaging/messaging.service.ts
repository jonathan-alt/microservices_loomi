import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqp from "amqplib";

import { rabbitmqConfig } from "../../config/rabbitmq.config";

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private connection: any;

  private channel: any;

  async onModuleInit() {
    console.log("Initializing...");
    await this.connect();
    await this.consumeTransferEvents();
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
      console.log("✅ RabbitMQ connected successfully");

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

      console.log("✅ RabbitMQ exchanges and queues configured");
    } catch (error) {
      console.error("❌ RabbitMQ connection failed:", error);
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
      console.log("✅ RabbitMQ disconnected");
    } catch (error) {
      console.error("❌ Error disconnecting RabbitMQ:", error);
    }
  }

  // Publicar eventos do client-service
  async publishClientEvent(event: string, data: any) {
    try {
      const message = JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString(),
        service: "client-service",
      });

      await this.channel.publish("client_events", event, Buffer.from(message));
      console.log(`Published client event: ${event}`);
    } catch (error) {
      console.error(`❌ Error publishing client event ${event}:`, error);
    }
  }

  // Consumir eventos do transfer-service
  async consumeTransferEvents() {
    try {
      await this.channel.consume("client_service_queue", (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());
          console.log(`Received transfer event: ${content.event}`);

          this.handleTransferEvent(content);
          this.channel.ack(msg);
        }
      });

      console.log("✅ Listening for transfer events");
    } catch (error) {
      console.error("❌ Error consuming transfer events:", error);
    }
  }

  private handleTransferEvent(event: any) {
    switch (event.event) {
      case "transfer.created":
        this.handleTransferCreated(event.data);
        break;
      case "transfer.completed":
        this.handleTransferCompleted(event.data);
        break;
      case "transfer.failed":
        this.handleTransferFailed(event.data);
        break;
      case "account.balance.updated":
        this.handleAccountBalanceUpdated(event.data);
        break;
      default:
        console.log(`Unknown transfer event: ${event.event}`);
    }
  }

  private handleTransferCreated(data: any) {
    console.log("Transfer created:", data);
    // Aqui você pode implementar lógica específica
    // Por exemplo, notificar o usuário sobre a transferência
  }

  private handleTransferCompleted(data: any) {
    console.log("✅ Transfer completed:", data);
    // Notificar usuário sobre transferência concluída
  }

  private handleTransferFailed(data: any) {
    console.log("❌ Transfer failed:", data);
    // Notificar usuário sobre falha na transferência
  }

  private handleAccountBalanceUpdated(data: any) {
    console.log("Account balance updated:", data);
    // Atualizar cache de dados do usuário
  }

  // Eventos específicos do client-service
  async publishUserRegistered(userData: any) {
    await this.publishClientEvent("user.registered", userData);
  }

  async publishUserUpdated(userData: any) {
    await this.publishClientEvent("user.updated", userData);
  }

  async publishUserLoggedIn(userData: any) {
    await this.publishClientEvent("user.logged_in", userData);
  }

  async publishUserLoggedOut(userData: any) {
    await this.publishClientEvent("user.logged_out", userData);
  }
}
