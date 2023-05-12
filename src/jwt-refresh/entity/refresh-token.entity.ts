import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class RefreshTokenEntity {
  constructor({ ...data }: Partial<RefreshTokenEntity>) {
    Object.assign(this, data);
  }

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  revoked: boolean;

  @Exclude()
  deviceId: string;
}
