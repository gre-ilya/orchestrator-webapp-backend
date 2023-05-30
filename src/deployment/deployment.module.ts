import { Module } from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { DeploymentController } from './deployment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import {HttpModule, HttpService} from "@nestjs/axios";

@Module({
  controllers: [DeploymentController],
  imports: [PrismaModule, HttpModule],
  providers: [DeploymentService],
  exports: [DeploymentService],
})
export class DeploymentModule {}
