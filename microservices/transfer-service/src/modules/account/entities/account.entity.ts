import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("accounts")
export class Account {
  @ApiProperty({ description: "ID único da conta", example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "ID do cliente", example: 1 })
  @Column({ name: "client_id", type: "int" })
  client_id: number;

  @ApiProperty({ description: "Saldo da conta", example: 1000.0 })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  value: number;

  @ApiProperty({ description: "ID do histórico", example: 1 })
  @Column({ name: "history_id", type: "int" })
  history_id: number;

  @ApiProperty({ description: "Número da agência", example: "0001" })
  @Column({ type: "varchar", length: 10 })
  agency: string;

  @ApiProperty({ description: "Número da conta", example: "123456-7" })
  @Column({ name: "account_number", type: "varchar", length: 20 })
  account_number: string;

  @ApiProperty({ description: "Data de criação" })
  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @ApiProperty({ description: "Data de atualização" })
  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
