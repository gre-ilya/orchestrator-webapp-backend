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
import { ProjectEntity } from '../src/project/entities/project.entity';
import { UserEntity } from '../src/user/entities/user.entity';
import { ServiceEntity } from '../src/service/entities/service.entity';
import { ServiceService } from '../src/service/service.service';
import {CreateServiceDto} from "../src/service/dto/create-service.dto";
import * as process from "process";

describe('service (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let projectService: ProjectService;
  let serviceService: ServiceService;
  let accessToken: string;
  let userBServiceUuid: string;
  let serviceRequestDTO = {
      name: 'service',
      repository: 'https://github.com/user/project'
  };
  let serviceResponseDTO = {
      id: null,
      name: serviceRequestDTO.name,
      repository: serviceRequestDTO.repository,
      buildCommand: null,
      deployCommand: null,
      ip: null,
      port: null,
      status: 'Disabled',
      variables: null,
    }
  let userA: UserEntity, userB: UserEntity;
  let userAProject: ProjectEntity, userBProject: ProjectEntity;
  let userAService = {
      id: null
  }
  let userBService: ServiceEntity;

  const testProject = {
    id: undefined,
    name: 'project',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = moduleFixture.get<UserService>(UserService);
    userA = await testingMethods.createNotExistingUser(userService);
    userB = await testingMethods.createNotExistingUser(userService);

    projectService = moduleFixture.get<ProjectService>(ProjectService);
    userAProject = await testingMethods.createProject(
      projectService,
      userA.email,
    );
    userBProject = await testingMethods.createProject(
      projectService,
      userB.email,
    );

    serviceService = moduleFixture.get<ServiceService>(ServiceService);
    userBService = await testingMethods.createService(
      serviceService,
      userB.email,
      userBProject.id,
    );

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
  });

  it('POST /projects/{project}/services Should return 401.', () => {
    return request(app.getHttpServer())
      .post(`/projects/${userAProject.id}/services`)
      .send(serviceRequestDTO)
      .expect(401);
  });

  it('GET /projects/{project}/services Should return 401.', () => {
    return request(app.getHttpServer())
      .get(`/projects/${userAProject.id}/services`)
      .send()
      .expect(401);
  });

  const serviceRandomUuid = crypto.randomUUID();
  it('GET /projects/{project}/services/{service} Should return 401.', () => {
    return request(app.getHttpServer())
      .get(`/projects/${userAProject.id}/services/${serviceRandomUuid}`)
      .send()
      .expect(401);
  });

  it('PATCH /projects/{project}/services/{service} Should return 401.', () => {
    return request(app.getHttpServer())
      .get(`/projects/${userAProject.id}/services/${serviceRandomUuid}`)
      .send()
      .expect(401);
  });

  it('DELETE /projects/{project}/services/{service} Should return 401.', () => {
    return request(app.getHttpServer())
      .get(`/projects/${userAProject.id}/services/${serviceRandomUuid}`)
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

    it('GET /projects/{project}/services Should return 200 and zero services.', async () => {
        const req = await request(app.getHttpServer())
            .get(`/projects/${userAProject.id}/services`)
            .set('Authorization', accessToken);
        expect(req.statusCode).toBe(200);
        expect(req.body.length).toBe(0);
    });

    it('GET /projects/{other-user-project}/services Should return 404.', async () => {
        return request(app.getHttpServer())
            .get(`/projects/${userBProject.id}/services`)
            .set('Authorization', accessToken)
            .expect(404);
    });

    it('GET /projects/{project}/services/{not-existing-service} Should return 404.', async () => {
        return request(app.getHttpServer())
            .get(`/projects/${userAProject.id}/services/${serviceRandomUuid}`)
            .set('Authorization', accessToken)
            .expect(404)
    });

    it('GET /projects/{other-user-project}/services/{other-user-service} Should return 404.', async () => {
        return request(app.getHttpServer())
            .get(`/projects/${userBProject.id}/services/${userBServiceUuid}`)
            .set('Authorization', accessToken)
            .expect(404)
    });

    it.each([
        [serviceRequestDTO, 201],
        [serviceRequestDTO, 201]
    ]) ('POST /projects/{project}/services Should return 201.', async (res, responseStatusCode) => {
        const req = await request(app.getHttpServer())
            .post(`/projects/${userAProject.id}/services`)
            .send(res)
            .set('Authorization', accessToken)
        expect(req.statusCode).toBe(responseStatusCode);
        expect(uuidValidate(req.body.id)).toBeTruthy();
        req.body.id = null
        expect(req.body).toStrictEqual(serviceResponseDTO)
    });

    it('POST /projects/{other-user-project}/services Should return 404.', () => {
        return request(app.getHttpServer())
            .post(`/projects/${userBProject.id}/services`)
            .send(serviceRequestDTO)
            .set('Authorization', accessToken)
            .expect(404);
    });

    it('GET /projects/{project}/services Should return 200 and 2 services.', async () => {
        const req = await request(app.getHttpServer())
            .get(`/projects/${userAProject.id}/services`)
            .set('Authorization', accessToken);
        expect(req.statusCode).toBe(200);
        expect(req.body.length).toBe(2);
        expect(uuidValidate(req.body[0].id)).toBeTruthy();
        userAService.id = req.body[0].id;
        req.body[0].id = null
        expect(req.body[0]).toStrictEqual({
            id: null,
            name: serviceRequestDTO.name,
            status: 'Disabled'
        });
    });

    it('GET /projects/{project}/services/{service} Should return 200 and service body.', async () => {
        const req = await request(app.getHttpServer())
            .get(`/projects/${userAProject.id}/services/${userAService.id}`)
            .set('Authorization', accessToken);
        expect(req.statusCode).toBe(200);
        expect(uuidValidate(req.body.id)).toBeTruthy();
        req.body.id = null;
        expect(req.body).toStrictEqual(serviceResponseDTO);
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
