import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt';
import * as process from 'process';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      +process.env.BCRYPT_SALTORROUNDS,
    );
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code == 'P2002') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException()
    }
  }

  async findOne(email: string) {
    const res = await this.prisma.user.findUnique({ where: { email: email } });
    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        +process.env.BCRYPT_SALTORROUNDS,
      );
    }
    try {
      return await this.prisma.user.update({ where: { email }, data: updateUserDto });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code == 'P2025') {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(email: string) {
    try {
      await this.prisma.user.delete({where: {email}});
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code == 'P2025') {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
    return HttpStatus.OK;
  }
}
