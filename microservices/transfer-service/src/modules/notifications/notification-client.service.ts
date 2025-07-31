import { Injectable, Logger } from "@nestjs/common";
import {
  NotificationServiceInterface,
  CreateNotificationDto,
  NotificationResponse,
} from "./notification-service.interface";

@Injectable()
export class NotificationClientService implements NotificationServiceInterface {
  private readonly logger = new Logger(NotificationClientService.name);

  async createNotification(
    data: CreateNotificationDto,
  ): Promise<NotificationResponse> {
    try {
      // Simular chamada HTTP para notification-service
      this.logger.log(
        `Creating notification for user ${data.userId}: ${data.title}`,
      );

      // Em produção, seria uma chamada HTTP real
      const notification: NotificationResponse = {
        id: `notif-${Date.now()}`,
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        status: "SENT",
        createdAt: new Date().toISOString(),
      };

      // Simular delay de processamento
      await new Promise((resolve) => setTimeout(resolve, 30));

      this.logger.log(`Notification created: ${notification.id}`);
      return notification;
    } catch (error: any) {
      this.logger.error(
        `Failed to create notification: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  async sendEmail(
    userId: number,
    subject: string,
    body: string,
  ): Promise<void> {
    try {
      this.logger.log(` Sending email to user ${userId}: ${subject}`);

      // Simular envio de email
      await this.simulateEmailSending(userId, subject, body);

      this.logger.log(` Email sent successfully to user ${userId}`);
    } catch (error: any) {
      this.logger.error(`Failed to send email: ${(error as Error).message}`);
      throw error;
    }
  }

  async sendSMS(phone: string, message: string): Promise<void> {
    try {
      this.logger.log(
        `Sending SMS to ${phone}: ${message.substring(0, 50)}...`,
      );

      // Simular envio de SMS
      await this.simulateSMSSending(phone, message);

      this.logger.log(` SMS sent successfully to ${phone}`);
    } catch (error: any) {
      this.logger.error(`Failed to send SMS: ${(error as Error).message}`);
      throw error;
    }
  }

  private async simulateEmailSending(
    userId: number,
    subject: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: string,
  ): Promise<void> {
    this.logger.log(`Simulating email to ${userId}: ${subject}`);
    // Simular delay de envio
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simular falha ocasional (5% das vezes)
    if (Math.random() < 0.05) {
      throw new Error("Email service temporarily unavailable");
    }
  }

  private async simulateSMSSending(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _phone: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _message: string,
  ): Promise<void> {
    // Simular delay de envio
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Simular falha ocasional (3% das vezes)
    if (Math.random() < 0.03) {
      throw new Error("SMS service temporarily unavailable");
    }
  }
}
