import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtAccessService {
    constructor(private jwtService: JwtService) {}
    createAccessToken(email: string) {
        return this.jwtService.sign({ email: email });
    }
}
