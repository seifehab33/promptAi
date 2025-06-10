// import { Transform } from 'class-transformer';
// import { User } from 'src/user/entities/user.entity';
// import { formatDate } from 'src/utils/format-date';
// import {
//   Column,
//   Entity,
//   ManyToMany,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';

// @Entity()
// export class Role {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;
//   @Column({ unique: true })
//   name: string;
//   @Column()
//   description: string;
//   @OneToMany(() => User, (user) => user.role)
//   users: User[]; // now we make user[] because one role can have many users
//   @Column()
//   @Transform(({ value }) => formatDate(value))
//   createdAt: Date;
//   @Column()
//   @Transform(({ value }) => formatDate(value))
//   updatedAt: Date;
// }
