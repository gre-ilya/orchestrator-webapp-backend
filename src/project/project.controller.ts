import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {ProjectEntity} from "./entities/project.entity";

@Controller('projects')
@ApiTags('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProjectEntity })
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.create(req.user['email'], createProjectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ProjectEntity] })
  async findAll(@Request() req) {
    return this.projectService.findAll(req.user['email']);
  }

  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProjectEntity })
  async findOne(@Param('uuid') uuid: string) {
    return this.projectService.findOne(uuid);
  }

  @Patch(':uuid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse( { type: ProjectEntity })
  async update(@Param('uuid') uuid: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(uuid, updateProjectDto);
  }

  @Delete('uuid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProjectEntity })
  async remove(@Param('uuid') uuid: string) {
    return this.projectService.remove(uuid);
  }
}
