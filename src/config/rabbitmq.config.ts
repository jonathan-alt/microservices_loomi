export const rabbitMQConfig = {
  host: process.env.RABBITMQ_HOST || "localhost",
  port: parseInt(process.env.RABBITMQ_PORT || "5672"),
  username: process.env.RABBITMQ_USERNAME || "guest",
  password: process.env.RABBITMQ_PASSWORD || "guest",
  vhost: process.env.RABBITMQ_VHOST || "/",
};

export const rabbitMQExchanges = {
  transfer: "transfer.exchange",
  client: "client.exchange",
};

export const rabbitMQQueues = {
  transferEvents: "transfer.events",
  clientEvents: "client.events",
  transferNotifications: "transfer.notifications",
};

export const rabbitMQRoutingKeys = {
  // Eventos publicados pelo Transfer Service
  transferCreated: "transfer.created",
  transferCompleted: "transfer.completed",
  transferFailed: "transfer.failed",
  accountBalanceUpdated: "account.balance.updated",

  // Eventos escutados pelo Transfer Service
  clientCreated: "client.created",
  clientUpdated: "client.updated",
};
