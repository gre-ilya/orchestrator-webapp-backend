import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAccessService {
  constructor(private jwtService: JwtService) {}
  async createAccessToken(email: string, role: string) {
    return this.jwtService.signAsync({ email: email, role: role });
  }
}
