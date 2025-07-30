import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("accounts")
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "client_id", type: "int" })
  client_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  value: number;

  @Column({ name: "history_id", type: "int" })
  history_id: number;

  @Column({ type: "varchar", length: 10 })
  agency: string;

  @Column({ name: "account_number", type: "varchar", length: 20 })
  account_number: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
