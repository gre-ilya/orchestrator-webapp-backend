import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt'
import {JwtRefreshService} from "../jwt-refresh/jwt-refresh.service";
import {JwtAccessService} from "../jwt-access/jwt-access.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtAccessService: JwtAccessService,
        private jwtRefreshService: JwtRefreshService
        // private refresh: RefreshService
    ) {}

    async login(email: string, password: string): Promise<AuthEntity> {
        // Step 1: Fetch a user with the given email
        const user = await this.prisma.user.findUnique({ where: { email: email } })

        // If no user is found, throw an error
        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`);
        }

        // Step 2: Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        // If password does not match, throw an error
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        // Step 3: Generate a JWT containing the user's ID and return it
        return {
            accessToken: this.jwtAccessService.createAccessToken(user.email),
            refreshToken: await this.jwtRefreshService.createRefreshToken(user.email)
        };
    }
}
