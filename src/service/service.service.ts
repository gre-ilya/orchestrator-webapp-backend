import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectService } from '../project/project.service';
import { DeploymentService } from '../deployment/deployment.service';

function getRandomInteger(min: number, max: number) {
  return Math.floor(
      Math.random() * (max - min) + min
  );
}

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService,
    private projectService: ProjectService,
    private deploymentService: DeploymentService
  ) {}

  async getAvailablePort(): Promise<number> {
    let randomPort: number;
    while (true) {
      randomPort = getRandomInteger(10000, 50000);
      let serviceWithRandomPort = await this.prisma.service.findMany({ where: { port: randomPort } });
      if (serviceWithRandomPort.length == 0) {
        break;
      }
    }
    return randomPort;
  }

  async assignPort(createServiceDto: CreateServiceDto) {
    createServiceDto.port = await this.getAvailablePort();
    return createServiceDto
  }

  async create(
    email: string,
    projectId: string,
    createServiceDto: CreateServiceDto,
  ) {
    if (!(await this.projectService.findOne(email, projectId))) {
      throw new NotFoundException();
    }
    createServiceDto.projectId = projectId;
    let createdService = await this.prisma.service.create({ data: await this.assignPort(createServiceDto) });
    await this.deploymentService.create(email, projectId, createdService.id);
    return createdService;
  }

  async findAll(email: string, projectId: string) {
    await this.projectService.findOne(email, projectId);
    return this.prisma.service.findMany({ where: { projectId: projectId } });
  }

  async findOne(email: string, projectId: string, id: string) {
    await this.projectService.findOne(email, projectId);
    const result = await this.prisma.service.findFirst({
      where: { id: id, projectId: projectId },
    });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async update(
    email: string,
    projectId: string,
    id: string,
    updateServiceDto: UpdateServiceDto,
  ) {
    await this.projectService.findOne(email, projectId);
    const updatedData = await this.prisma.service.updateMany({
      where: {
        id: id,
        projectId: projectId,
      },
      data: updateServiceDto,
    });
    if (!updatedData.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }

  async remove(email: string, projectId: string, id: string) {
    await this.projectService.findOne(email, projectId);
    const deletedAmount = await this.prisma.service.deleteMany({
      where: {
        id: id,
        projectId: projectId,
      },
    });
    if (!deletedAmount.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }
}
