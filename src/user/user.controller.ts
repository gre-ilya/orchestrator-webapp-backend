import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {UserEntity} from "./entities/user.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiResponseModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Request() req) {
    return new UserEntity(await this.usersService.findOne(req.user.email));
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.usersService.update(req.user.email, updateUserDto));
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async remove(@Request() req) {
    return await this.usersService.remove(req.user.email);
  }
}
