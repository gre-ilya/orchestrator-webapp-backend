import {forwardRef, Module} from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { DeploymentController } from './deployment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import {HttpModule, HttpService} from "@nestjs/axios";
import {ServiceModule} from "../service/service.module";

@Module({
  controllers: [DeploymentController],
  imports: [PrismaModule, HttpModule, forwardRef(() => ServiceModule)],
  providers: [DeploymentService],
  exports: [DeploymentService],
})
export class DeploymentModule {}
