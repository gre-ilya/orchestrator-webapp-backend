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

  async create(email: string, projectId: string, serviceId: string) {
    let service: Service;
    try {
      service = await this.prisma.service.findUnique({where: {id: serviceId}});
    } catch (err) {
      throw new NotFoundException();
    }
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
    let serviceId;
    try {
      serviceId = (await this.prisma.deployment.findUnique({ where: { id: deploymentId } })).serviceId;
    } catch (err) {
      throw new NotFoundException();
    }
    await this.prisma.service.updateMany({ where: { id: serviceId }, data: { status: updateDeploymentDto.status }});
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
    let service: Service;
    try {
      service = await this.prisma.service.findUnique({where: {id: serviceId}});
    } catch (err) {
      throw new NotFoundException();
    }
    this.deleteDeployFromOrchestratorService(service.port, deploymentId);
    return HttpStatus.OK;
  }

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
      await this.handleError(err, deployment.id);
    }
  }

  async deleteDeployFromOrchestratorService(port: number, deploymentId: string) {
    try {
      await firstValueFrom(this.http.delete(
          `${process.env.ORCHESTRATOR_URL}/api/deploys`,
          {
            data: {
              port: port,
              deploymentId: deploymentId
            }
          },
      ))
    } catch (err) {
      await this.handleError(err, deploymentId);
    }
  }

  async handleError(err, deploymentId: string) {
    let buildLogs: string;
    if (err.code ===  AxiosError.ERR_BAD_RESPONSE) {
      buildLogs = 'Orchestrator internal error.';
      if (err.response.data.message) {
        buildLogs = err.response.data.message;
      }
    } else {
      buildLogs = 'No connection with orchestrator web-service.'
    }
    await this.prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        buildLogs: buildLogs,
        status: 'Failed'
      }
    });
  }
}
