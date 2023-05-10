import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import * as process from 'process';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshModule } from '../jwt-refresh/jwt-refresh.module';
import { JwtAccessModule } from '../jwt-access/jwt-access.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
    JwtAccessModule,
    JwtRefreshModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
