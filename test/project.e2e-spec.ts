import { Test, TestingModule } from '@nestjs/testing';
import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { Reflector } from '@nestjs/core';
import { UserService } from '../src/user/user.service';
import { AppModule } from '../src/app.module';
import {CreateUserDto} from "../src/user/dto/create-user.dto";
const crypto = require('crypto');
const uuidValidate = require('uuid-validate');
import {ProjectService} from "../src/project/project.service";

describe('project (e2e)', () => {
    let app: INestApplication;
    let userService: UserService;
    let projectService: ProjectService;
    let access_token: string;
    let notExistingProjectUuid: string;
    let otherUserProjectUuid: string;

    const test_user = {
        email: undefined,
        password: 'superpass',
    };

    const test_project = {
        id: undefined,
        name: 'project',
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        userService = moduleFixture.get<UserService>(UserService);
        projectService = moduleFixture.get<ProjectService>(ProjectService);
        let count = 0;
        while (true) {
            const test_email: string = `test${count}@mail.ru`;
            try {
                await userService.findOne(test_email);
            } catch (NotFoundException) {
                test_user.email = test_email;
                await userService.create(new CreateUserDto(test_user.email, test_user.password));
                break;
            }
            count++;
        }
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({whitelist: true}));
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

    it('GET /projects/{project-random-uuid} Should return 401.', () => {
        return request(app.getHttpServer()).get(`/projects/${crypto.randomUUID()}`).send().expect(401);
    });

    it('PATCH /projects Should return 401.', () => {
        return request(app.getHttpServer()).get('/projects').send().expect(401);
    });

    it('DELETE /projects Should return 401.', () => {
        return request(app.getHttpServer()).get('/projects').send().expect(401);
    });

    it('POST /auth/login Should return 201 and { access_token, refresh_token }', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: test_user.email, password: test_user.password })
            .expect(201);

        access_token = `Bearer ${res.body.accessToken}`;
    });

    it('GET /projects Should return 200 and zero projects.', async () => {
        const req = await request(app.getHttpServer())
            .get('/projects')
            .set('Authorization', access_token)
        expect(req.statusCode).toBe(200);
        expect(req.body.length).toBe(0);
    });

    it.each([
        [{ name: test_project.name }, 201],
        [{ name: test_project.name }, 201]
    ])('POST /projects Should return 201 and { id, name }.', async (req, responseStatusCode) => {
        const res = await request(app.getHttpServer())
            .post('/projects')
            .set('Authorization', access_token)
            .send(req)

        expect(res.statusCode).toBe(responseStatusCode);
        expect(res.body.name).toBe(test_project.name);
        expect(uuidValidate(res.body.id)).toBeTruthy();
        test_project.id = res.body.id;
    });

    it('GET /projects Should return 200 and two projects.', async () => {
        const req = await request(app.getHttpServer())
            .get('/projects')
            .set('Authorization', access_token)
        expect(req.statusCode).toBe(200);
        expect(req.body.length).toBe(2);
        expect(req.body[0].name).toBe(test_project.name);
        expect(uuidValidate(req.body[0].id)).toBeTruthy();
    });

    it('GET /projects/{not-uuid} Should return 400.', () => {
        request(app.getHttpServer())
            .get('/projects/not-uuid')
            .set('Authorization', access_token)
            .expect(400);
    });

    it('GET /projects/{project-not-existing-uuid} Should return 404.', async () => {
        while (true) {
            notExistingProjectUuid = crypto.randomUUID();
            console.log(notExistingProjectUuid)
            try {
                await projectService.findOne(test_user.email, notExistingProjectUuid);
            } catch (NotFoundException) {
                break;
            }
        }
        request(app.getHttpServer())
            .get(`/projects/${notExistingProjectUuid}`)
            .set('Authorization', access_token)
            .expect(404);
    });

    it('GET /projects/{project-existing-uuid} Should return 200 and { id, name }.', async () => {
        const res = await request(app.getHttpServer())
            .get(`/projects/${test_project.id}`)
            .set('Authorization', access_token)
        expect(uuidValidate(res.body.id)).toBeTruthy();
        expect(res.body.name).toBe(test_project.name);
        expect(res.statusCode).toBe(200);
    });

    it('PATCH /projects/{not-uuid} Should return 400.', () => {
        request(app.getHttpServer())
            .patch('/projects/not-uuid')
            .set('Authorization', access_token)
            .send({ name: 'newname' })
            .expect(400);
    });


    it('PATCH /projects/{project-not-existing-uuid} Should return 404.', async () => {
        request(app.getHttpServer())
            .patch(`/projects/${notExistingProjectUuid}`)
            .set('Authorization', access_token)
            .send({ name: 'newname' })
            .expect(404);
    });

    it('PATCH /projects/{project-existing-uuid} Should return 200 and { name }.', async () => {
        request(app.getHttpServer())
            .patch(`/projects/${test_project.id}`)
            .set('Authorization', access_token)
            .send({ name: 'newname' })
            .expect(200, { name: 'newname' });
    });

    it('DELETE /projects/{not-uuid} Should return 400.', () => {
        request(app.getHttpServer())
            .delete('/projects/not-uuid')
            .set('Authorization', access_token)
            .expect(400);
    });

    it('DELETE /projects/{project-not-existing-uuid} Should return 404.', async () => {
        request(app.getHttpServer())
            .delete(`/projects/${notExistingProjectUuid}`)
            .set('Authorization', access_token)
            .expect(404);
    });

    it('DELETE /projects/{project-existing-uuid} Should return 200.', async () => {
        request(app.getHttpServer())
            .delete(`/projects/${test_project.id}`)
            .set('Authorization', access_token)
            .expect(200);
    });


    afterAll(async () => {
        try {
            await userService.remove(test_user.email);
        } catch (err) {}
        await app.close();
    });
});
