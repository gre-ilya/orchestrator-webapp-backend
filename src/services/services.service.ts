import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class ServicesService {

  constructor(private prisma: PrismaService) {}
  async create(email: string, projectId: string, createServiceDto: CreateServiceDto) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userEmail: email
      }
    })
    if (!project) {
      throw new NotFoundException()
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
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userEmail: email
      }
    })
    if (!project) {
      throw new NotFoundException()
    }
    const result = await this.prisma.service.findFirst({ where: { id: id, projectId: projectId } });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userEmail: email
      }
    })
    if (!project) {
      throw new NotFoundException()
    }
    return `This action updates a #${id} service`;
  }

  async remove(id: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userEmail: email
      }
    })
    if (!project) {
      throw new NotFoundException()
    }
    return `This action removes a #${id} service`;
  }
}
