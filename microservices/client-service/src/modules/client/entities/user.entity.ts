import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, length: 14 })
  cpf: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  agency: string;

  @Column({ nullable: true })
  account_number: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
