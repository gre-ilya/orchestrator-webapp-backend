import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAccessService } from '../jwt-access/jwt-access.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import * as process from 'process';

@Injectable()
export class JwtRefreshService {
  constructor(
    private jwtAccessService: JwtAccessService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async getOne(jti: string) {
    return this.prisma.refreshToken.findUnique({
      where: {
        jti: jti,
      },
    });
  }

  async createRefreshToken(email: string, role: string) {
    await this.killSessions(email);
    const jti = await this.jwtService.signAsync({ email: email, role: role });
    try {
      await this.prisma.refreshToken.create({
        data: {
          jti: jti,
          deviceId: crypto.randomUUID(),
          userEmail: email,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code == 'P2002'
      ) {
        return jti;
      }
      throw new InternalServerErrorException();
    }
    return jti;
  }

  async killSessions(email: string) {
    await this.prisma.refreshToken.updateMany({
      where: {
        userEmail: email,
      },
      data: {
        revoked: true,
      },
    });
  }

  // Now only one session allowed
  async refreshTokens(jti: string) {
    try {
      await this.jwtService.verifyAsync(jti, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
    const token = await this.getOne(jti);
    if (!token) {
      throw new NotFoundException();
    }
    if (token.revoked) {
      throw new UnauthorizedException();
    }
    const email = this.jwtService.decode(jti)['email'];
    await this.killSessions(email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    const role = user.role;
    return {
      accessToken: await this.jwtAccessService.createAccessToken(email, role),
      refreshToken: await this.createRefreshToken(email, role),
    };
  }
}
