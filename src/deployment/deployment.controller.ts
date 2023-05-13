import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';

@Controller('projects/:project/services/:service')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Post()
  create(@Body() createDeploymentDto: CreateDeploymentDto) {
    return this.deploymentService.create(createDeploymentDto);
  }

  @Get()
  findAll() {
    return this.deploymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deploymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeploymentDto: UpdateDeploymentDto) {
    return this.deploymentService.update(+id, updateDeploymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deploymentService.remove(+id);
  }
}
