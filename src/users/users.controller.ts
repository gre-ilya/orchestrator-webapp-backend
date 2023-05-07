import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {UserEntity} from "./entities/user.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async get(@Request() req) {
    return new UserEntity(await this.usersService.get(req.user['email']))
  }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Patch()
  @ApiCreatedResponse({ type: UserEntity })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.usersService.update(req.user['email'], updateUserDto));
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async remove(@Request() req) {
    return new UserEntity(await this.usersService.remove(req.user['email']));
  }
}
