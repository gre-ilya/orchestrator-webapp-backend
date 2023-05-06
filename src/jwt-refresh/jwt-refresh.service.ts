import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {JwtAccessService} from "../jwt-access/jwt-access.service";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class JwtRefreshService {
    constructor(
        private jwtAccessService: JwtAccessService,
        private prisma: PrismaService
    ) {}

    async getOne(jti: string) {
        return this.prisma.refreshToken.findUnique({
            where: {
                jti: jti
            }
        })
    }

    // Now only one session allowed
    async refreshTokens(jti: string) {
        const token = await this.getOne(jti);
        if (!token) {
            throw new NotFoundException();
        }
        if (token.revoked) {
            throw new UnauthorizedException();
        }
        await this.prisma.refreshToken.update({
            where: {
                jti: jti
            },
            data: {
                revoked: true
            }
        })
        const refreshToken = 'qwe';
        const accessToken = 'qwe';
        return {
            refreshToken: refreshToken,
            accessToken: accessToken
        }
    }
}
