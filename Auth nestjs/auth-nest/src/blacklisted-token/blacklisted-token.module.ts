import { Module } from '@nestjs/common';
import { BlacklistedTokenService } from './blacklisted-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistedToken } from './entities/blacklisted-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistedToken])],
  providers: [BlacklistedTokenService],
  exports: [BlacklistedTokenService, TypeOrmModule],
})
export class BlacklistedTokenModule {}
