import { Body, Controller, Post } from '@nestjs/common';
import { JwtRefreshService } from './jwt-refresh.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenEntity } from './entity/refresh-token.entity';

@Controller('auth/jwt-refresh')
@ApiTags('auth')
export class JwtRefreshController {
  constructor(private jwtRefreshService: JwtRefreshService) {}

  @Post()
  @ApiCreatedResponse({ type: RefreshTokenEntity })
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return new RefreshTokenEntity(
      await this.jwtRefreshService.refreshTokens(refreshTokenDto.refreshToken),
    );
  }
}
