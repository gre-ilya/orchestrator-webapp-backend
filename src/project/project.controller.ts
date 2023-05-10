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
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectEntity } from './entities/project.entity';

@Controller('projects')
@ApiTags('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProjectEntity })
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return new ProjectEntity(
      await this.projectService.create(req.user.email, createProjectDto),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ProjectEntity] })
  async findAll(@Request() req) {
    return ProjectEntity.handleArray(
      await this.projectService.findAll(req.user.email),
    );
  }

  @Get(':project')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProjectEntity })
  @ApiParam({ name: 'project', required: true })
  async findOne(@Request() req, @Param() params) {
    const result = await this.projectService.findOne(
      req.user.email,
      params.project,
    );
    if (!result) {
      throw new NotFoundException();
    }
    return new ProjectEntity(result);
  }

  @Patch(':project')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiParam({ name: 'project', required: true })
  async update(
    @Request() req,
    @Param() params,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(
      req.user.email,
      params.project,
      updateProjectDto,
    );
  }

  @Delete(':project')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiParam({ name: 'project', required: true })
  async remove(@Request() req, @Param() params) {
    return await this.projectService.remove(req.user.email, params.project);
  }
}
