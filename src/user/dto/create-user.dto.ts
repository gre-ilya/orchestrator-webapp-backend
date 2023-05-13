import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;
}
