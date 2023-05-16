import { Deployment, DeploymentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class DeploymentEntity implements Deployment {
  constructor(partial: Partial<DeploymentEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  buildLogs: string;

  @ApiProperty()
  deployLogs: string;

  @ApiProperty()
  status: DeploymentStatus;

  @ApiProperty()
  buildDate: Date;

  @Exclude()
  serviceId: string;
}
