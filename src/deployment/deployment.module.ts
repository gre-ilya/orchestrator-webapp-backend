import { Module } from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { DeploymentController } from './deployment.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [DeploymentController],
  providers: [DeploymentService],
  imports: [PrismaModule],
})
export class DeploymentModule {}
