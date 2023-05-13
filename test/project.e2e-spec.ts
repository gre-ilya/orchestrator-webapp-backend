import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import * as testingMethods from './testing-methods';
import { Reflector } from '@nestjs/core';
import { UserService } from '../src/user/user.service';
import { AppModule } from '../src/app.module';
import * as crypto from 'crypto';
import * as uuidValidate from 'uuid-validate';
import { ProjectService } from '../src/project/project.service';
import { CreateProjectDto } from '../src/project/dto/create-project.dto';
import { ProjectEntity } from '../src/project/entities/project.entity';
import { UserEntity } from '../src/user/entities/user.entity';

describe('project (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let projectService: ProjectService;
  let accessToken: string;
  let notExistingProjectUuid: string;
  let userA: UserEntity, userB: UserEntity;
  let userAProject = {
    id: undefined,
    name: 'project',
  }
  let userBProject: ProjectEntity;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    userService = moduleFixture.get<UserService>(UserService);

    userA = await testingMethods.createNotExistingUser(userService);
    userB = await testingMethods.createNotExistingUser(userService);

    projectService = moduleFixture.get<ProjectService>(ProjectService);
    userBProject = await testingMethods.createProject(projectService, userB.email);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
  });

  it('POST /projects Should return 401.', () => {
    return request(app.getHttpServer()).post('/projects').send().expect(401);
  });

  it('GET /projects Should return 401.', () => {
    return request(app.getHttpServer()).get('/projects').send().expect(401);
  });

  const projectRandomUuid = crypto.randomUUID();
  it('GET /projects/{project-random-uuid} Should return 401.', () => {
    return request(app.getHttpServer())
      .get(`/projects/${projectRandomUuid}`)
      .send()
      .expect(401);
  });

  it('PATCH /projects/{project-random-uuid} Should return 401.', () => {
    return request(app.getHttpServer())
      .get(`/projects/${projectRandomUuid}`)
      .send()
      .expect(401);
  });

  it('DELETE /projects/{project-random-uuid} Should return 401.', () => {
    return request(app.getHttpServer())
      .get(`/projects/${projectRandomUuid}`)
      .send()
      .expect(401);
  });

  it('POST /auth/login Should return 201 and { accessToken, refresh_token }', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userA.email, password: userA.password })
      .expect(201);
    accessToken = `Bearer ${res.body.accessToken}`;
  });

  it('GET /projects Should return 200 and zero projects.', async () => {
    const req = await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', accessToken);
    expect(req.statusCode).toBe(200);
    expect(req.body.length).toBe(0);
  });

  it.each([
    [{ name: userAProject.name }, 201],
    [{ name: userAProject.name }, 201],
  ])(
    'POST /projects Should return 201 and { id, name }.',
    async (req, responseStatusCode) => {
      const res = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', accessToken)
        .send(req);

      expect(res.statusCode).toBe(responseStatusCode);
      expect(res.body.name).toBe(userAProject.name);
      expect(uuidValidate(res.body.id)).toBeTruthy();
      userAProject.id = res.body.id;
    },
  );

  it('GET /projects Should return 200 and two projects.', async () => {
    const req = await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', accessToken);
    expect(req.statusCode).toBe(200);
    expect(req.body.length).toBe(2);
    expect(req.body[0].name).toBe(userAProject.name);
    expect(uuidValidate(req.body[0].id)).toBeTruthy();
  });

  it('GET /projects/{not-uuid} Should return 400.', () => {
    request(app.getHttpServer())
      .get('/projects/not-uuid')
      .set('Authorization', accessToken)
      .expect(400);
  });

  it('GET /projects/{project-not-existing-uuid} Should return 404.', async () => {
    const notExistingProjectUuid = await testingMethods.generateNotExistingProjectUuid(projectService, userA.email)
    request(app.getHttpServer())
      .get(`/projects/${notExistingProjectUuid}`)
      .set('Authorization', accessToken)
      .expect(404);
  });

  it('GET /projects/{project-existing-uuid} Should return 200 and { id, name }.', async () => {
    const res = await request(app.getHttpServer())
      .get(`/projects/${userAProject.id}`)
      .set('Authorization', accessToken);
    expect(uuidValidate(res.body.id)).toBeTruthy();
    expect(res.body.name).toBe(userAProject.name);
    expect(res.statusCode).toBe(200);
  });

  it('GET /projects/{other-user-project-existing-uuid} Should return 404.', async () => {
    request(app.getHttpServer())
      .get(`/projects/${userBProject.id}`)
      .set('Authorization', accessToken)
      .expect(404);
  });

  it('PATCH /projects/{not-uuid} Should return 400.', () => {
    request(app.getHttpServer())
      .patch('/projects/not-uuid')
      .set('Authorization', accessToken)
      .send({ name: 'newname' })
      .expect(400);
  });

  it('PATCH /projects/{project-not-existing-uuid} Should return 404.', async () => {
    request(app.getHttpServer())
      .patch(`/projects/${notExistingProjectUuid}`)
      .set('Authorization', accessToken)
      .send({ name: 'newname' })
      .expect(404);
  });

  it('PATCH /projects/{project-existing-uuid} Should return 200 and { name }.', async () => {
    request(app.getHttpServer())
      .patch(`/projects/${userAProject.id}`)
      .set('Authorization', accessToken)
      .send({ name: 'newname' })
      .expect(200, { name: 'newname' });
  });

  it('PATCH /projects/{other-user-project-existing-uuid} Should return 404.', async () => {
    request(app.getHttpServer())
      .patch(`/projects/${userBProject.id}`)
      .set('Authorization', accessToken)
      .send({ name: 'newname' })
      .expect(404);
  });

  it('DELETE /projects/{not-uuid} Should return 400.', () => {
    request(app.getHttpServer())
      .delete('/projects/not-uuid')
      .set('Authorization', accessToken)
      .expect(400);
  });

  it('DELETE /projects/{project-not-existing-uuid} Should return 404.', async () => {
    request(app.getHttpServer())
      .delete(`/projects/${notExistingProjectUuid}`)
      .set('Authorization', accessToken)
      .expect(404);
  });

  it('DELETE /projects/{project-existing-uuid} Should return 200.', async () => {
    request(app.getHttpServer())
      .delete(`/projects/${userAProject.id}`)
      .set('Authorization', accessToken)
      .expect(200);
  });

  it('DELETE /projects/{other-user-project-existing-uuid} Should return 404.', async () => {
    request(app.getHttpServer())
      .delete(`/projects/${userBProject.id}`)
      .set('Authorization', accessToken)
      .expect(404);
  });

  afterAll(async () => {
    try {
      await userService.remove(userA.email);
    } catch (err) {}
    try {
      await userService.remove(userB.email);
    } catch (err) {}
    await app.close();
  });
});
