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

@Controller('projects/:project/services/:service')
@ApiTags('deployments')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: DeploymentEntity })
  @ApiParam({ name: 'service', required: true })
  @ApiParam({ name: 'project', required: true })
  create(
    @Request() req,
    @Param() params,
    @Body() createDeploymentDto: CreateDeploymentDto,
  ) {
    return this.deploymentService.create(req.user.email, params.project, params.service);
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: [DeploymentEntity] })
  // @ApiParam({ name: 'service', required: true })
  // @ApiParam({ name: 'project', required: true })
  // findAll(@Request() req, @Param() params) {
  //   return this.deploymentService.findAll();
  // }
  //
  // @Get(':deployment')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: DeploymentEntity })
  // @ApiParam({ name: 'deployment', required: true })
  // @ApiParam({ name: 'service', required: true })
  // @ApiParam({ name: 'project', required: true })
  // findOne(@Request() req, @Param() params) {
  //   return this.deploymentService.findOne(+id);
  // }
  //
  // @Patch(':deployment')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse()
  // @ApiParam({ name: 'deployment', required: true })
  // @ApiParam({ name: 'service', required: true })
  // @ApiParam({ name: 'project', required: true })
  // update(@Request() req, @Param() params, @Body() updateDeploymentDto: UpdateDeploymentDto) {
  //   return this.deploymentService.update(+id, updateDeploymentDto);
  // }
  //
  // @Delete(':deployment')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse()
  // @ApiParam({ name: 'deployment', required: true })
  // @ApiParam({ name: 'service', required: true })
  // @ApiParam({ name: 'project', required: true })
  // remove(@Request() req, @Param() params) {
  //   return this.deploymentService.remove(+id);
  // }
}
