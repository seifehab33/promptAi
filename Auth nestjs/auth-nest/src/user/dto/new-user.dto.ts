import { Expose, Type } from 'class-transformer';

class RoleDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
}

export class NewUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}
