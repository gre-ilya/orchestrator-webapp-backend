import { DeploymentStatus, Prisma, Service } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class JsonObject implements Prisma.JsonObject {}

export class ServicePreviewEntity implements Service {
  constructor(partial: Partial<ServicePreviewEntity>) {
    Object.assign(this, partial);
  }

  static handleArray(partialArray: Partial<ServicePreviewEntity[]>) {
    const result: ServicePreviewEntity[] = [];
    partialArray.forEach((val, index) => {
      result.push(new ServicePreviewEntity(val));
    });
    return result;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: DeploymentStatus;

  @Exclude()
  repository: string;

  @Exclude()
  builderTemplate: number;

  @Exclude()
  buildCommand: string;

  @Exclude()
  deployCommand: string;

  @Exclude()
  ip: string;

  @Exclude()
  internalPort: number;

  @Exclude()
  url: string;

  @Exclude()
  port: number;

  @Exclude()
  variables: JsonObject;

  @Exclude()
  projectId: string;
}
