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

@Controller('projects/:project/services')
@ApiTags('services')
export class ServiceController {
  constructor(private readonly servicesService: ServiceService) {}

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
    return new ServiceEntity(
      await this.servicesService.create(
        req.user.email,
        params.project,
        createServiceDto,
      ),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ServicePreviewEntity] })
  @ApiParam({ name: 'project', required: true })
  async findAll(@Request() req, @Param() params) {
    return ServicePreviewEntity.handleArray(
      await this.servicesService.findAll(req.user.email, params.project),
    );
  }

  @Get(':service')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  async findOne(@Request() req, @Param() params) {
    return new ServiceEntity(
      await this.servicesService.findOne(
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
    return this.servicesService.update(
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
    return this.servicesService.remove(
      req.user.email,
      params.project,
      params.service,
    );
  }
}
