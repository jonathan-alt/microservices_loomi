export interface CreateNotificationDto {
  userId: number;
  type: "TRANSFER_SUCCESS" | "TRANSFER_FAILED" | "ACCOUNT_UPDATE";
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface NotificationResponse {
  id: string;
  userId: number;
  type: string;
  title: string;
  message: string;
  status: "SENT" | "PENDING" | "FAILED";
  createdAt: string;
}

export interface NotificationServiceInterface {
  createNotification(
    data: CreateNotificationDto,
  ): Promise<NotificationResponse>;
  sendEmail(userId: number, subject: string, body: string): Promise<void>;
  sendSMS(phone: string, message: string): Promise<void>;
}
