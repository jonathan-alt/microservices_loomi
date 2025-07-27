import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateAccountDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  client_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  history_id: number;
}
