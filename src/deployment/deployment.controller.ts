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
  Query, NotFoundException,
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
import * as uuid from 'uuid';

@Controller()
@ApiTags('deployments')
export class DeploymentController {
  constructor(
      private deploymentService: DeploymentService,
  ) {}

  @Post('projects/:project/services/:service/deployments')
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

  @Get('projects/:project/services/:service/deployments')
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

  @Get('projects/:project/services/:service/deployments/:deployment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DeploymentEntity })
  @ApiParam({ name: 'deployment', required: true })
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  async findOne(@Request() req, @Param() params) {
    if (!uuid.validate(params.deployment)) {
      throw new NotFoundException();
    }
    return new DeploymentEntity(
      await this.deploymentService.findOne(
        req.user.email,
        params.project,
        params.service,
        params.deployment,
      ),
    );
  }

  @Patch('deployments/:deployment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiParam({ name: 'deployment', required: true })
  update(
    @Request() req,
    @Param() params,
    @Body() updateDeploymentDto: UpdateDeploymentDto,
  ) {
    if (!uuid.validate(params.deployment)) {
      throw new NotFoundException();
    }
    return this.deploymentService.update(
      req.user.email,
      params.deployment,
      updateDeploymentDto,
        req.user.role
    );
  }

  @Delete('projects/:project/services/:service/deployments/:deployment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiParam({ name: 'deployment', required: true })
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  remove(@Request() req, @Param() params) {
    if (!uuid.validate(params.deployment)) {
      throw new NotFoundException();
    }
    return this.deploymentService.remove(
      req.user.email,
      params.project,
      params.service,
      params.deployment,
    );
  }
}
