import {HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import {PrismaService} from "../prisma/prisma.service";
import * as process from "process";
import {ServiceService} from "../service/service.service";

@Injectable()
export class DeploymentService {

  constructor(private prisma: PrismaService) {}
  async create(email: string, projectId: string, serviceId: string) {
    const querry = await this.prisma.user.findUnique({
      where: {
        email: email
      },
      select: {
        projects: {
          where: {
            id: projectId
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
      await this.prisma.deployment.create({
        data: {
          serviceId: serviceId
        }
      });
      return HttpStatus.CREATED;
    }
    throw new NotFoundException();
  }

  findAll() {
    return `This action returns all deployment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deployment`;
  }

  update(id: number, updateDeploymentDto: UpdateDeploymentDto) {
    return `This action updates a #${id} deployment`;
  }

  remove(id: number) {
    return `This action removes a #${id} deployment`;
  }
}
