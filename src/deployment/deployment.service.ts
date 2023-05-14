import {HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import {PrismaService} from "../prisma/prisma.service";
import * as process from "process";
import {ServiceService} from "../service/service.service";

@Injectable()
export class DeploymentService {

  constructor(private prisma: PrismaService, private serviceService: ServiceService) {}
  async create(email: string, projectId: string, serviceId: string) {
    const querry = await this.prisma.user.findUnique({
      where: {
        email
      },
      select: {
        projects: {
          where: {
            id: projectId,
          },
          select: {
            services: {
              where: {
                id: serviceId
              }
            }
          }
        }
      }
    })
    if (querry.projects.length && querry.projects[0].services.length) {
      return this.prisma.deployment.create({
        data: {
          serviceId: serviceId
        }
      });
    }
    throw new NotFoundException();
  }

  async findAll(email: string, projectId: string, serviceId: string) {
    const query = await this.prisma.user.findUnique({
      where: {
        email
      },
      select: {
        projects: {
          where: {
            id: projectId
          },
          select: {
            services: {
              where: {
                projectId: projectId
              },
              select: {
                deployments: {
                  where: {
                    serviceId: serviceId
                  }
                }
              }
            }
          }
        }
      }
    });
    return query.projects[0].services[0].deployments
  }

  async findOne(email: string, projectId: string, serviceId: string, deploymentId: string) {
    await this.serviceService.findOne(email, projectId, serviceId);
    return this.prisma.deployment.findUnique({ where: { id: deploymentId } })
  }

  async update(email: string, projectId: string, serviceId: string, deploymentId: string, updateDeploymentDto: UpdateDeploymentDto) {
    await this.serviceService.findOne(email, projectId, serviceId);
    const updatedData = await this.prisma.deployment.updateMany({
      where: {
        id: deploymentId,
        serviceId: serviceId
      },
      data: updateDeploymentDto
    })
    if (!updatedData.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }

  async remove(email: string, projectId: string, serviceId: string, deploymentId: string) {
    await this.serviceService.findOne(email, projectId, serviceId);
    const deletedData = await this.prisma.deployment.deleteMany({
      where: {
        id: deploymentId,
        serviceId: serviceId
      },
    });
    if (!deletedData.count) {
      throw new NotFoundException();
    }
    return HttpStatus.OK;
  }
}
