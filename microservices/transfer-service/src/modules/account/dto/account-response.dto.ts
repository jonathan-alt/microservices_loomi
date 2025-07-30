export class AccountResponseDto {
  id: number;
  client_id: number;
  value: number;
  history_id: number;
  agency: string;
  account_number: string;
  created_at?: Date;
  updated_at?: Date;
}
