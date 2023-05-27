import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectModule } from '../project/project.module';
import { ProjectService } from '../project/project.service';
import { DeploymentModule } from '../deployment/deployment.module';
import { DeploymentService } from '../deployment/deployment.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, ProjectService, DeploymentService],
  imports: [PrismaModule, ProjectModule, DeploymentModule],
  exports: [ServiceService],
})
export class ServiceModule {}
