import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JsonObject } from '../entities/service.entity';

export class CreateServiceDto {
  constructor(partial: Partial<CreateServiceDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  repository: string;

  ip: string;

  port: number;

  variables: JsonObject;

  projectId: string;
}
