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
  NotFoundException,
  Req
} from '@nestjs/common';
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
    return new ProjectEntity(await this.projectService.create(req.user.email, createProjectDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ProjectEntity] })
  async findAll(@Request() req) {
    return ProjectEntity.handleArray(await this.projectService.findAll(req.user.email));
  }

  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProjectEntity })
  async findOne(@Request() req, @Param('uuid') uuid: string) {
    const result = await this.projectService.findOne(req.user.email, uuid);
    if (!result) {
      throw new NotFoundException();
    }
    return new ProjectEntity(result);
  }

  @Patch(':uuid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse( { type: ProjectEntity })
  async update(@Request() req, @Param('uuid') uuid: string, @Body() updateProjectDto: UpdateProjectDto) {
    return new ProjectEntity(await this.projectService.update(req.user.email ,uuid, updateProjectDto));
  }

  @Delete('uuid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async remove(@Request() req, @Param('uuid') uuid: string) {
    return await this.projectService.remove(req.user.email, uuid);
  }
}
