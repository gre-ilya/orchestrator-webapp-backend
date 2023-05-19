import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceService } from '../service/service.service';

@Injectable()
export class DeploymentService {
  constructor(
    private prisma: PrismaService,
    private serviceService: ServiceService,
  ) {}
  async create(email: string, projectId: string, serviceId: string) {
    await this.serviceService.findOne(email, projectId, serviceId)
    return this.prisma.deployment.create({
      data: {
        serviceId: serviceId,
      },
    });
  }

  async findAll(email: string, projectId: string, serviceId: string) {
    await this.serviceService.findOne(email, projectId, serviceId);
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
    await this.serviceService.findOne(email, projectId, serviceId);
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
    if (isAdmin) {
      const deployment = await this.prisma.deployment.findMany({
        where: {
          id: deploymentId,
          serviceId: serviceId
        }
      });
      if (!deployment.length) {
        throw new NotFoundException();
      }
      await this.prisma.deployment.update({
        where: {
          id: deploymentId
        },
        data: updateDeploymentDto
      })
    }
    await this.serviceService.findOne(email, projectId, serviceId);
    const updatedData = await this.prisma.deployment.updateMany({
      where: {
        id: deploymentId,
        serviceId: serviceId,
      },
      data: updateDeploymentDto,
    });
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
    await this.serviceService.findOne(email, projectId, serviceId);
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
