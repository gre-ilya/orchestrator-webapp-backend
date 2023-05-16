import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtRefreshModule } from './jwt-refresh/jwt-refresh.module';
import { JwtAccessModule } from './jwt-access/jwt-access.module';
import { ProjectModule } from './project/project.module';
import { ServiceModule } from './service/service.module';
import { DeploymentModule } from './deployment/deployment.module';
import {HttpModule} from "@nestjs/axios";
import { OrchestratorModule } from './orchestrator/orchestrator.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    AuthModule,
    JwtRefreshModule,
    JwtAccessModule,
    ProjectModule,
    ServiceModule,
    DeploymentModule,
    HttpModule,
    OrchestratorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
