import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  async create(email: string, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        userEmail: email
      }
    });
  }

  async findAll(email: string) {
    return this.prisma.project.findMany({ where: { userEmail: email } })
  }

  async findOne(id: string) {
    return this.prisma.service.findUnique({ where: { id } });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({ where: { id }, data: updateProjectDto });
  }

  async remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
