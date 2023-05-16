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
  Query,
} from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DeploymentEntity } from './entities/deployment.entity';
import { DeploymentPreviewEntity } from './entities/deployment-preview.entity';

@Controller('projects/:project/services/:service/deployments')
@ApiTags('deployments')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: DeploymentPreviewEntity })
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  async create(
    @Request() req,
    @Param() params,
    @Body() createDeploymentDto: CreateDeploymentDto,
  ) {
    return new DeploymentPreviewEntity(
      await this.deploymentService.create(
        req.user.email,
        params.project,
        params.service,
      ),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [DeploymentPreviewEntity] })
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  async findAll(@Request() req, @Param() params) {
    return DeploymentPreviewEntity.handleArray(
      await this.deploymentService.findAll(
        req.user.email,
        params.project,
        params.service,
      ),
    );
  }

  @Get(':deployment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DeploymentEntity })
  @ApiParam({ name: 'deployment', required: true })
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  async findOne(@Request() req, @Param() params) {
    return new DeploymentEntity(
      await this.deploymentService.findOne(
        req.user.email,
        params.project,
        params.service,
        params.deployment,
      ),
    );
  }

  @Patch(':deployment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiParam({ name: 'deployment', required: true })
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  update(
    @Request() req,
    @Param() params,
    @Body() updateDeploymentDto: UpdateDeploymentDto,
  ) {
    return this.deploymentService.update(
      req.user.email,
      params.project,
      params.service,
      params.deployment,
      updateDeploymentDto,
    );
  }

  @Delete(':deployment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiParam({ name: 'deployment', required: true })
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  remove(@Request() req, @Param() params) {
    return this.deploymentService.remove(
      req.user.email,
      params.project,
      params.service,
      params.deployment,
    );
  }
}
