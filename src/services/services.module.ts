import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  imports: [PrismaModule],
  exports: [ServicesService],
})
export class ServicesModule {}
