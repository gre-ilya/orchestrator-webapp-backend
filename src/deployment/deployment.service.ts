import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceService } from '../service/service.service';
import {HttpService} from "@nestjs/axios";
import * as process from 'process';
import {firstValueFrom} from "rxjs";
import {Service} from "@prisma/client";
import {AxiosError} from "axios";

// TODO: Make get methods more secure
@Injectable()
export class DeploymentService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService
  ) {}
  async create(email: string, projectId: string, service: Service) {
    let createdDeployment = await this.prisma.deployment.create({
      data: {
        serviceId: service.id
      }
    })
    let res;
    try {
      res = await firstValueFrom(this.http.post(
          `${process.env.ORCHESTRATOR_URL}/api/deploys`,
          {
            repository: service.repository,
            port: service.port,
            internalPort: service.internalPort,
            nodesAmount: 1,
            mainDirectoryPath: './',
            deploymentId: createdDeployment.id
          })
      );
    } catch (err) {
      let deployLogs: string;
      if (err.code ===  AxiosError.ERR_BAD_RESPONSE) {
        deployLogs = 'Orchestrator internal error.';
        if (err.response.data.message) {
          deployLogs = err.response.data.message;
        }
      } else {
        deployLogs = 'No connection with orchestrator web-service.'
      }
      createdDeployment = await this.prisma.deployment.update({
        where: { id: createdDeployment.id },
        data: {
          deployLogs: deployLogs,
          status: 'Failed'
        }
      });
    }
    return createdDeployment;
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
