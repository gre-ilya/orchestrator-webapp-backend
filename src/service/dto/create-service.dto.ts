import {IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';
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

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  internalPort: number;

  ip: string;

  port: number;

  url: string;

  variables: JsonObject;

  projectId: string;
}
