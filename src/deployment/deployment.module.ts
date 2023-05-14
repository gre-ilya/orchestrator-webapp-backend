import { Module } from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { DeploymentController } from './deployment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import {ServiceModule} from "../service/service.module";
import {ServiceService} from "../service/service.service";
import {ProjectModule} from "../project/project.module";
import {ProjectService} from "../project/project.service";

@Module({
  controllers: [DeploymentController],
  providers: [DeploymentService, ServiceService, ProjectService],
  imports: [PrismaModule, ServiceModule, ProjectModule],
})
export class DeploymentModule {}
