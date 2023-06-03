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
import {Deployment, Service} from "@prisma/client";
import {AxiosError} from "axios";

// TODO: Make get methods more secure
@Injectable()
export class DeploymentService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService
  ) {}

  async sendDeployToOrchestratorService(service: Service, deployment: Deployment) {
    try {
      await firstValueFrom(this.http.post(
          `${process.env.ORCHESTRATOR_URL}/api/deploys`,
          {
            repository: service.repository,
            port: service.port,
            internalPort: service.internalPort,
            nodesAmount: 1,
            mainDirectoryPath: './',
            deploymentId: deployment.id
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
      await this.prisma.deployment.update({
        where: { id: deployment.id },
        data: {
          deployLogs: deployLogs,
          status: 'Failed'
        }
      });
    }
  }
  async create(email: string, projectId: string, service: Service) {
    let createdDeployment = await this.prisma.deployment.create({
      data: {
        serviceId: service.id
      }
    })
    this.sendDeployToOrchestratorService(service, createdDeployment);
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
    userRole: string
  ) {
    if (userRole != 'Admin') {
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
    if (updateDeploymentDto.deployLogs === '') {
      delete updateDeploymentDto.deployLogs;
    }
    if (updateDeploymentDto.buildLogs === '') {
      delete updateDeploymentDto.buildLogs;
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
