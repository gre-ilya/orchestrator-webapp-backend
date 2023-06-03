import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ServiceEntity } from './entities/service.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ServicePreviewEntity } from './entities/service-preview.entity';
import * as uuid from 'uuid';
import process from 'process';
import {AxiosError} from "axios";

@Controller('projects/:project/services')
@ApiTags('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ServiceEntity })
  @ApiParam({ name: 'project', required: true })
  async create(
    @Request() req,
    @Param() params,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    if (!uuid.validate(params.project)) {
      throw new NotFoundException();
    }
    createServiceDto.projectId = params.project;
    try {
      return new ServiceEntity(
          await this.serviceService.create(
              req.user.email,
              params.project,
              createServiceDto,
          ),
      );
    } catch (err) {
      console.log(err)
      let errorResponse = { 'message': 'Internal error.' };
      if (err instanceof AxiosError) {
        errorResponse.message = 'No connection with orchestrator.';
      }
      throw new InternalServerErrorException(errorResponse);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ServicePreviewEntity] })
  @ApiParam({ name: 'project', required: true })
  async findAll(@Request() req, @Param() params) {
    if (!uuid.validate(params.project)) {
      throw new NotFoundException();
    }
    return ServicePreviewEntity.handleArray(
      await this.serviceService.findAll(req.user.email, params.project),
    );
  }

  @Get(':service')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  async findOne(@Request() req, @Param() params) {
    if (!uuid.validate(params.project) || !uuid.validate(params.service)) {
      throw new NotFoundException();
    }
    return new ServiceEntity(
      await this.serviceService.findOne(
        req.user.email,
        params.project,
        params.service,
      ),
    );
  }

  @Patch(':service')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  async update(
    @Request() req,
    @Param() params,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    if (!uuid.validate(params.project) || !uuid.validate(params.service)) {
      throw new NotFoundException();
    }
    return this.serviceService.update(
      req.user.email,
      params.project,
      params.service,
      updateServiceDto,
    );
  }

  @Delete(':service')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  async remove(@Request() req, @Param() params) {
    return this.serviceService.remove(
      req.user.email,
      params.project,
      params.service,
    );
  }
}
