import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as process from 'process';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  async create(email: string, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        userEmail: email,
      },
    });
  }

  async findAll(email: string) {
    return this.prisma.project.findMany({ where: { userEmail: email } });
  }

  async findOne(email: string, uuid: string) {
    return this.prisma.project.findFirst({
      where: {
        id: uuid,
        userEmail: email,
      },
    });
  }

  async update(
    email: string,
    uuid: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    const updatedAmount = await this.prisma.project.updateMany({
      where: { id: uuid, userEmail: email },
      data: updateProjectDto,
    });
    if (!updatedAmount.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }

  async remove(email: string, uuid: string) {
    const res = await this.prisma.project.deleteMany({
      where: {
        id: uuid,
        userEmail: email,
      },
    });
    if (!res.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }
}
