import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 14, unique: true })
  cpf: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone: string;

  @Column({ type: "text", nullable: true })
  picture: string;

  @Column({ type: "varchar", length: 10, nullable: true })
  agency: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  account_number: string;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
