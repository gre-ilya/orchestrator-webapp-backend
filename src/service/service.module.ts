import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {ProjectModule} from "../project/project.module";
import {ProjectService} from "../project/project.service";

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, ProjectService],
  imports: [PrismaModule, ProjectModule],
  exports: [ServiceService],
})
export class ServiceModule {}
