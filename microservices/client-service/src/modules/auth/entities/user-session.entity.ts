import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("user_sessions")
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "client_id", type: "int" })
  client_id: number;

  @Column({ name: "token_hash", type: "varchar", length: 255 })
  token_hash: string;

  @Column({ name: "expires_at", type: "timestamp" })
  expires_at: Date;

  @Column({ name: "is_revoked", type: "boolean", default: false })
  is_revoked: boolean;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
