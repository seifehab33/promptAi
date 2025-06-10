import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { BlacklistedTokenModule } from 'src/blacklisted-token/blacklisted-token.module';
import { BlacklistedToken } from 'src/blacklisted-token/entities/blacklisted-token.entity';

@Module({
  imports: [
    UserModule,
    BlacklistedTokenModule,
    JwtModule.register({
      global: true,
      secret: 'ssssss$%$#',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([RefreshToken, BlacklistedToken]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
