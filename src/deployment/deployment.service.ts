import {ForbiddenException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceService } from '../service/service.service';

// TODO: Make get methods more secure
@Injectable()
export class DeploymentService {
  constructor(
    private prisma: PrismaService,
  ) {}
  async create(email: string, projectId: string, serviceId: string) {
    return this.prisma.deployment.create({
      data: {
        serviceId: serviceId,
      },
    });
  }

  async findAll(email: string, projectId: string, serviceId: string) {
    return this.prisma.deployment.findMany({
      where: {
        serviceId: serviceId
      }
    })
  }

  async findOne(
    email: string,
    projectId: string,
    serviceId: string,
    deploymentId: string,
  ) {
    return this.prisma.deployment.findUnique({ where: { id: deploymentId } });
  }

  async update(
    email: string,
    projectId: string,
    serviceId: string,
    deploymentId: string,
    updateDeploymentDto: UpdateDeploymentDto,
    isAdmin: boolean
  ) {
    if (!isAdmin) {
      throw new ForbiddenException();
    }
    const deployment = await this.prisma.deployment.findMany({
      where: {
        id: deploymentId,
        serviceId: serviceId
      }
    });
    if (!deployment.length) {
      throw new NotFoundException();
    }
    let updatedData = await this.prisma.deployment.updateMany({
      where: {
        id: deploymentId
      },
      data: updateDeploymentDto
    })
    if (!updatedData.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }

  async remove(
    email: string,
    projectId: string,
    serviceId: string,
    deploymentId: string,
  ) {
    const deletedData = await this.prisma.deployment.deleteMany({
      where: {
        id: deploymentId,
        serviceId: serviceId,
      },
    });
    if (!deletedData.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }
}
