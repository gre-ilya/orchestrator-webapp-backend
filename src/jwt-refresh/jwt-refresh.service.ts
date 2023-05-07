import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {JwtAccessService} from "../jwt-access/jwt-access.service";
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import * as crypto from "crypto";
import * as process from "process";

@Injectable()
export class JwtRefreshService {
    constructor(
        private jwtAccessService: JwtAccessService,
        private jwtService: JwtService,
        private prisma: PrismaService
    ) {}

    async getOne(jti: string) {
        return this.prisma.refreshToken.findUnique({
            where: {
                jti: jti
            }
        })
    }

    async createRefreshToken(email: string) {
        await this.killSessions(email);
        const jti = this.jwtService.sign({ email: email });
        await this.prisma.refreshToken.create({
            data: {
                jti: jti,
                deviceId: crypto.randomUUID(),
                userEmail: email,
            }
        })
        return jti;
    }

    async killSessions(email: string) {
        await this.prisma.refreshToken.updateMany({
            where: {
                userEmail: email
            },
            data: {
                revoked: true
            }
        })
    }

    // Now only one session allowed
    async refreshTokens(jti: string) {
        try {
            this.jwtService.verify(jti, {secret: process.env.JWT_REFRESH_SECRET});
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
        console.log(process.env.DEBUG, this.jwtService.verify(jti, {secret: process.env.JWT_REFRESH_SECRET}))
        const email = this.jwtService.decode(jti)['email'];
        await this.killSessions(email);
        return {
            accessToken: this.jwtAccessService.createAccessToken(email),
            refreshToken: await this.createRefreshToken(email)
        }
    }
}
