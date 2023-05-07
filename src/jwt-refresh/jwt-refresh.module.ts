import { Module } from '@nestjs/common';
import { JwtRefreshService } from './jwt-refresh.service';
import {JwtAccessModule} from "../jwt-access/jwt-access.module";
import {JwtAccessService} from "../jwt-access/jwt-access.service";
import {JwtModule} from "@nestjs/jwt";
import * as process from "process";
import {PrismaModule} from "../prisma/prisma.module";
import { JwtRefreshController } from './jwt-refresh.controller';

@Module({
  imports: [
      JwtAccessModule,
      PrismaModule,
      JwtModule.register({
        secret: process.env.JWT_REFRESH_SECRET,
        signOptions: { expiresIn: '30d' }
      })
  ],
  providers: [JwtRefreshService, JwtAccessService],
  controllers: [JwtRefreshController],
  exports: [JwtRefreshService]
})
export class JwtRefreshModule {}
