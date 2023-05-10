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
    createUserDto.passwordHash = await bcrypt.hash(
      createUserDto.passwordHash,
      +process.env.BCRYPT_SALTORROUNDS,
    );
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code == 'P2002') {
          throw new ConflictException();
        }
        throw new InternalServerErrorException()
      }
    }
  }

  async findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.passwordHash) {
      updateUserDto.passwordHash = await bcrypt.hash(
        updateUserDto.passwordHash,
        +process.env.BCRYPT_SALTORROUNDS,
      );
    }
    return this.prisma.user.update({ where: { email }, data: updateUserDto });
  }

  async remove(email: string) {
    await this.prisma.user.delete({ where: { email } });
    return HttpStatus.OK;
  }
}
