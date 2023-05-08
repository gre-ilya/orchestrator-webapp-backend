import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {ApiBearerAuth, ApiCreatedResponse, ApiOkResponse} from "@nestjs/swagger";
import {ServiceEntity} from "./entities/service.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('projects/:project/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ServiceEntity })
  async create(@Request() req, @Param('project') projectUuid, @Body() createServiceDto: CreateServiceDto) {
    return new ServiceEntity(await this.servicesService.create(req.user.email, projectUuid, createServiceDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ServiceEntity] })
  async findAll(@Request() req, @Param('project') projectId) {
    return this.servicesService.findAll(req.user.email, projectId);
  }

  @Get(':service')
  async findOne(@Request() req, @Param('project') project: string, @Param('service') service) {
    return this.servicesService.findOne(req.user.email, project, service);
  }

  @Patch(':service')
  async update(@Request() req, @Param('project') project: string, @Param('service') service, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(req.user.email, project, service, updateServiceDto);
  }

  @Delete(':service')
  async remove(@Request() req, @Param('project') project: string, @Param('service') service: string) {
    return this.servicesService.remove(req.user.email, project, service);
  }
}
