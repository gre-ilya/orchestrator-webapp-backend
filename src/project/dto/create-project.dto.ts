import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  constructor(partial: Partial<CreateProjectDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
