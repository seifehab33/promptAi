import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { formatDate } from 'src/utils/format-date';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('prompts')
export class PromptEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: 'Prompt Title' })
  promptTitle: string;
  @Column({ default: 'Prompt Description' })
  promptDescription: string;
  @Column({ nullable: true, type: 'simple-array' })
  promptTags: string[];
  @Column({ default: 'Prompt Context' })
  promptContext: string;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => formatDate(value))
  createdAt: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => formatDate(value))
  updatedAt: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => formatDate(value))
  last_access: Date;
  @Column({ type: 'json', nullable: true })
  likes: string[];
  @Index()
  @Column({ default: false })
  isPublic: boolean;
  @ManyToOne(() => User, (user) => user.prompts)
  @JoinColumn({ name: 'userId' })
  user: User;
}
