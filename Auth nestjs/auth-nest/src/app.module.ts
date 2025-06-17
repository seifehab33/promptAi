import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
// import { RoleModule } from './role/role.module';
import { LoggerMiddleware } from './logger.middleware';
// import { Role } from './role/enitites/role.entity';
import { BlacklistedTokenModule } from './blacklisted-token/blacklisted-token.module';
import { BlacklistedToken } from './blacklisted-token/entities/blacklisted-token.entity';
import { PromptsModule } from './prompts/prompts.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, BlacklistedToken]),
    AuthModule,
    UserModule,
    // RoleModule,
    BlacklistedTokenModule,
    PromptsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // log all routes
  }
}
