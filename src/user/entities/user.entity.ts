import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User, UserRole } from '@prisma/client';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  isActivated: boolean;

  @Exclude()
  activationLink: string;

  @Exclude()
  role: UserRole;
}
