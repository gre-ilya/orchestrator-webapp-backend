import {HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {PrismaService} from "../prisma/prisma.service";
import {ProjectService} from "../project/project.service";

@Injectable()
export class ServiceService {

  constructor(private prisma: PrismaService, private projectService: ProjectService) {}
  async create(email: string, projectId: string, createServiceDto: CreateServiceDto) {
    if (!await this.projectService.findOne(email, projectId)) {
      throw new NotFoundException();
    }
    createServiceDto.projectId = projectId;
    return this.prisma.service.create({ data: createServiceDto });
  }

  async findAll(email: string, projectId: string) {
    const project = await this.prisma.project.findMany({
      where: {
        id: projectId,
        userEmail: email
      }
    })
    if (!project) {
      throw new NotFoundException()
    }
    return this.prisma.service.findMany({ where: { projectId: projectId } });
  }

  async findOne(email: string, projectId: string, id: string) {
    if (!await this.projectService.findOne(email, projectId)) {
      throw new NotFoundException();
    }
    const result = await this.prisma.service.findFirst({ where: { id: id, projectId: projectId } });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async update(email: string, projectId: string, id: string, updateServiceDto: UpdateServiceDto) {
    if (!await this.projectService.findOne(email, projectId)) {
      throw new NotFoundException();
    }
    const updateAmount = await this.prisma.service.updateMany({
      where: {
        id: id,
        projectId: projectId
      }, data: updateServiceDto
    });
    if (!updateAmount.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }

  async remove(email: string, projectId: string, id: string) {
    if (!await this.projectService.findOne(email, projectId)) {
      throw new NotFoundException();
    }
    const deletedAmount = await this.prisma.service.deleteMany({
      where: {
        id: id,
        projectId: projectId
      }
    })
    if (!deletedAmount.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }
}
