// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// // import { Role } from './enitites/role.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { CreateRoleDto } from './dto/role.dto';

// @Injectable()
// export class RoleService {
//   constructor() // @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
//   {}

//   async create(dto: CreateRoleDto) {
//     const role = this.roleRepo.create(dto);
//     return this.roleRepo.save(role);
//   }

//   async findAll() {
//     return this.roleRepo.find();
//   }
// }
