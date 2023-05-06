import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.passwordHash = await bcrypt.hash(createUserDto.passwordHash, 10);
    return this.prisma.user.create({ data: createUserDto });
  }

  getAll() {
    return this.prisma.user.findMany();
  }

  async get(email: string) {
    return this.prisma.user.findFirst({ where: { email: email } })
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.passwordHash) {
      updateUserDto.passwordHash = await bcrypt.hash(updateUserDto.passwordHash, 10);
    }
    return this.prisma.user.update({ where: { email }, data: updateUserDto });
  }

  remove(email: string) {
    return this.prisma.user.delete({ where: { email } });
  }
}
