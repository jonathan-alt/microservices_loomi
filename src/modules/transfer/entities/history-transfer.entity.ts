export class HistoryTransfer {
  id: number;
  account_id: number;
  transfer_value: number;
  target_id_account: number;
  timestamp: Date;
  description?: string;
  new_value: number;
  old_value: number;
  type: string; // "TRANSFER", "DEPOSIT", "WITHDRAWAL", etc.
}
