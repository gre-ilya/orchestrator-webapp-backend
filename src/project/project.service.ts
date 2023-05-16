import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';

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

  async findOne(email: string, projectId: string) {
    const res = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userEmail: email,
      },
    });
    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  async update(
    email: string,
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    const updatedAmount = await this.prisma.project.updateMany({
      where: { id: projectId, userEmail: email },
      data: updateProjectDto,
    });
    if (!updatedAmount.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }

  async remove(email: string, projectId: string) {
    const res = await this.prisma.project.deleteMany({
      where: {
        id: projectId,
        userEmail: email,
      },
    });
    if (!res.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }
}
