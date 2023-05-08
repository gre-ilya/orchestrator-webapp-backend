import {HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.passwordHash = await bcrypt.hash(createUserDto.passwordHash, 10);
    return this.prisma.user.create({ data: createUserDto });
  }

  async findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } })
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.passwordHash) {
      updateUserDto.passwordHash = await bcrypt.hash(updateUserDto.passwordHash, 10);
    }
    return this.prisma.user.update({ where: { email }, data: updateUserDto });
  }

  async remove(email: string) {
    await this.prisma.user.delete({ where: { email } });
    return HttpStatus.OK;
  }
}
