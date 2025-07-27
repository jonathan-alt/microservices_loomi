// Eventos externos (de outros microserviços)
export const CLIENT_EVENTS = {
  CREATED: "client.created",
  UPDATED: "client.updated",
  DELETED: "client.deleted",
} as const;

export const ACCOUNT_EVENTS = {
  BALANCE_UPDATED: "account.balance.updated",
  CREATED: "account.created",
  UPDATED: "account.updated",
} as const;

export type ClientEventType =
  (typeof CLIENT_EVENTS)[keyof typeof CLIENT_EVENTS];
export type AccountEventType =
  (typeof ACCOUNT_EVENTS)[keyof typeof ACCOUNT_EVENTS];
