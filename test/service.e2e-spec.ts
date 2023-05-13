import { Test, TestingModule } from '@nestjs/testing';
import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import * as testingMethods from './testing-methods'
import { Reflector } from '@nestjs/core';
import { UserService } from '../src/user/user.service';
import { AppModule } from '../src/app.module';
const crypto = require('crypto');
const uuidValidate = require('uuid-validate');
import {ProjectService} from "../src/project/project.service";
import {ProjectEntity} from "../src/project/entities/project.entity";
import {UserEntity} from "../src/user/entities/user.entity";
import {ServiceEntity} from "../src/service/entities/service.entity";
import {ServiceService} from "../src/service/service.service";

describe('service (e2e)', () => {
    let app: INestApplication;
    let userService: UserService;
    let projectService: ProjectService;
    let serviceService: ServiceService;
    let accessToken: string;
    let notExistingServiceUuid: string;
    let userBServiceUuid: string;
    let userA: UserEntity, userB: UserEntity;
    let userAProject: ProjectEntity, userBProject: ProjectEntity;
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
        userA = await testingMethods.createNotExistingUser(userService, 'superpass')
        userB = await testingMethods.createNotExistingUser(userService, 'superpass');

        projectService = moduleFixture.get<ProjectService>(ProjectService);
        userAProject = await testingMethods.createProject(projectService, userA.email);
        userBProject = await testingMethods.createProject(projectService, userB.email);

        serviceService = moduleFixture.get<ServiceService>(ServiceService);
        userBService = await testingMethods.createService(serviceService, userB.email, userBProject.id);

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        app.useGlobalInterceptors(
            new ClassSerializerInterceptor(app.get(Reflector)),
        );
        await app.init();
    });

    it('POST /projects/{project-existing-uuid}/services Should return 401.', () => {
        return request(app.getHttpServer()).post(`/projects/${userAProject.id}/services`).send().expect(401);
    });

    it('GET /projects/project-existing-uuid/services Should return 401.', () => {
        return request(app.getHttpServer()).get(`/projects/${userAProject.id}/services`).send().expect(401);
    });

    let serviceRandomUuid = crypto.randomUUID();
    it('GET /projects/{project-existing-uuid}/services/{service-random-uuid} Should return 401.', () => {
        return request(app.getHttpServer()).get(`/projects/${userAProject.id}/services/${serviceRandomUuid}`).send().expect(401);
    });

    it('PATCH /projects/{project-existing-uuid}/services/{service-random-uuid} Should return 401.', () => {
        return request(app.getHttpServer()).get(`/projects/${userAProject.id}/services/${serviceRandomUuid}`).send().expect(401);
    });

    it('DELETE /projects/{project-existing-uuid}/services/{service-random-uuid} Should return 401.', () => {
        return request(app.getHttpServer()).get(`/projects/${userAProject.id}/services/${serviceRandomUuid}`).send().expect(401);
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
