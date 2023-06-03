import { Module } from '@nestjs/common';
import { JwtAccessService } from './jwt-access.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [JwtAccessService],
  exports: [JwtAccessService],
})
export class JwtAccessModule {}
