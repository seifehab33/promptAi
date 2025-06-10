import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blacklisted_tokens')
export class BlacklistedToken {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Index()
  token: string;
  @Column({ type: 'datetime' })
  expiresAt: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
