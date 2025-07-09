import { Transform } from 'class-transformer';
import { MinLength } from 'class-validator';
import { PromptEntity } from 'src/prompts/entity/prompt.entity';
// import { Role } from 'src/role/enitites/role.entity';
import { formatDate } from 'src/utils/format-date';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  @MinLength(6)
  password: string;

  @OneToMany(() => PromptEntity, (prompt) => prompt.user)
  prompts: PromptEntity[];
  @Column({ default: 10 })
  tokensFree: number;
  @Column({ default: 0 })
  tokensUsed: number;
  @Column({ default: 10 })
  tokensRemaining: number;
  @Column({ default: false })
  isPremium: boolean;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => formatDate(value))
  createdAt: Date;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => formatDate(value))
  updatedAt: Date;
}
