import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {ApiBearerAuth, ApiCreatedResponse} from "@nestjs/swagger";
import {ServiceEntity} from "./entities/service.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('projects/:project-uuid/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post(':project-uuid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ServiceEntity })
  async create(@Request() req, @Param('project-uuid') projectUuid, @Body() createServiceDto: CreateServiceDto) {
    return new ServiceEntity(await this.servicesService.create(req.user.email, projectUuid, createServiceDto));
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
