import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UserService } from '../src/user/user.service';
import { UserEntity } from '../src/user/entities/user.entity';
import { ProjectService } from '../src/project/project.service';
import { CreateProjectDto } from '../src/project/dto/create-project.dto';
import { ProjectEntity } from '../src/project/entities/project.entity';
import { ServiceService } from '../src/service/service.service';
import { CreateServiceDto } from '../src/service/dto/create-service.dto';
import { ServiceEntity } from '../src/service/entities/service.entity';
import * as crypto from 'crypto';

export async function generateNotExistingUser(userService: UserService) {
  let count = 0;
  const testUser = {
    email: undefined,
  };
  while (true) {
    const testEmail = `test${count}@mail.ru`;
    try {
      await userService.findOne(testEmail);
    } catch (NotFoundException) {
      testUser.email = testEmail;
      return new UserEntity(testUser);
    }
    count++;
  }
}

export async function createNotExistingUser(userService: UserService) {
  const user = await generateNotExistingUser(userService);
  user.password = 'superpass';
  await userService.create(
    new CreateUserDto({ email: user.email, password: user.password }),
  );
  return new UserEntity(user);
}

export async function createProject(
  projectService: ProjectService,
  userEmail: string,
) {
  const project = await projectService.create(
    userEmail,
    new CreateProjectDto({ name: 'name' }),
  );
  return new ProjectEntity(project);
}

export async function createService(
  serviceService: ServiceService,
  email: string,
  projectId: string,
) {
  const service = await serviceService.create(
    email,
    projectId,
    new CreateServiceDto({
      name: 'name',
      repository: 'https://github.com/user/repo',
      projectId: projectId,
    }),
  );
  return new ServiceEntity(service);
}

export async function generateNotExistingProjectUuid(projectService: ProjectService, email: string) {
  while (true) {
    const notExistingProjectUuid = crypto.randomUUID();
    try {
      await projectService.findOne(email, notExistingProjectUuid);
    } catch (NotFoundException) {
      return notExistingProjectUuid;
    }
  }
}
