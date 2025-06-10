// import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// // import { RoleService } from './role.service';
// import { CreateRoleDto } from './dto/role.dto';

// @Controller('role')
// export class RoleController {
//   // constructor(private readonly roleService: RoleService) {}
//   @UseGuards(JwtAuthGuard)
//   @Get()
//   findRoles() {
//     return this.roleService.findAll();
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post()
//   createRole(@Body() dto: CreateRoleDto) {
//     return this.roleService.create(dto);
//   }
// }
