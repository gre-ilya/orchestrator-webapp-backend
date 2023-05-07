import {Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import { JwtRefreshModule } from './jwt-refresh/jwt-refresh.module';
import { JwtAccessModule } from './jwt-access/jwt-access.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UsersModule, AuthModule, JwtRefreshModule, JwtAccessModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
