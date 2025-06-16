import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ResetPasswordsEnitity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  token: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column()
  expiresAt: Date;
  @Column({ default: false })
  isUsed: boolean;
}
