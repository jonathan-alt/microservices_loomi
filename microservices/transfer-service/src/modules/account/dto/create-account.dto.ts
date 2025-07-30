import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from "class-validator";

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

  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  agency: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  account_number: string;
}
