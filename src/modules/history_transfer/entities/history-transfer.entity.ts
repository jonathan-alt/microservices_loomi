import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("history_transfer")
export class HistoryTransfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "account_id", type: "int" })
  account_id: number;

  @Column({ name: "transfer_value", type: "decimal", precision: 10, scale: 2 })
  transfer_value: number;

  @Column({ name: "target_id_account", type: "int" })
  target_id_account: number;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @Column({ type: "varchar", nullable: true })
  description: string;

  @Column({ name: "new_value", type: "decimal", precision: 10, scale: 2 })
  new_value: number;

  @Column({ name: "old_value", type: "decimal", precision: 10, scale: 2 })
  old_value: number;

  @Column({ type: "varchar" })
  type: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
