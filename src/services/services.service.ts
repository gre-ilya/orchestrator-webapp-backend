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
    return this.prisma.service.create({ data: createServiceDto });
  }

  findAll() {
    return `This action returns all services`;
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
