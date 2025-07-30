export interface RabbitMQConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  queue: string;
}

export const rabbitmqConfig: RabbitMQConfig = {
  host: process.env.RABBITMQ_HOST || "localhost",
  port: parseInt(process.env.RABBITMQ_PORT || "5672", 10),
  username: process.env.RABBITMQ_USERNAME || "guest",
  password: process.env.RABBITMQ_PASSWORD || "guest",
  queue: process.env.RABBITMQ_QUEUE || "client_service_queue",
};
