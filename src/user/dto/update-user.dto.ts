import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  constructor(partial: Partial<UpdateUserDto>) {
    Object.assign(this, partial);
  }

  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;

  role: UserRole;

  isActivated: boolean;

  activationLink: string;
}
