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
import * as testingMethods from './testing-methods';
import { UserEntity } from '../src/user/entities/user.entity';
import * as process from 'process';

describe('user (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let accessToken: string;

  let user: UserEntity;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    userService = moduleFixture.get<UserService>(UserService);
    user = await testingMethods.findNotExistingUser(userService);
    user.password = 'superpass';

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
  });

  it('GET /users Should return 401.', () => {
    return request(app.getHttpServer()).get('/users').send().expect(401);
  });

  it('PATCH /users Should return 401.', () => {
    return request(app.getHttpServer()).patch('/users').send().expect(401);
  });

  it('DELETE /users Should return 401.', () => {
    return request(app.getHttpServer()).delete('/users').send().expect(401);
  });

  it('POST /users Should return 400 (short password).', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: user.email, password: 'shorttt' })
      .expect(400);
  });

  it('POST /users Should return 400 (wrong mail).', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'noemail', password: user.password })
      .expect(400);
  });

  it('POST /users Should return 201 and { email }.', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: user.email, password: user.password })
      .expect(201, { email: user.email });
  });

  it('POST /users Should return 409.', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: user.email, password: user.password })
      .expect(409);
  });

  it('POST /auth/login Should return 201 and { accessToken, refresh_token }', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(201);
    accessToken = `Bearer ${res.body.accessToken}`;
  });

  it('GET /users Should return 200 and { email }.', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', accessToken)
      .expect(200, { email: user.email });
  });

  it('PATCH /users Should return 400 (short password).', () => {
    return request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', accessToken)
      .send({ password: 'short' })
      .expect(400);
  });

  it('PATCH /users Should return 200 and { email } (password updated).', () => {
    return request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', accessToken)
      .send({ password: 'newsuperpass' })
      .expect(200, { email: user.email });
  });

  it('POST /auth/login Should return 401 (auth with old password).', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(401);
  });

  it('POST /auth/login Should return 201 (auth with new password).', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: 'newsuperpass' })
      .expect(201);
  });

  it('DELETE /users Should return 200.', () => {
    return request(app.getHttpServer())
      .delete('/users')
      .set('Authorization', accessToken)
      .send()
      .expect(200);
  });

  it('GET /users Should return 404.', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', accessToken)
      .expect(404);
  });

  it('PATCH /users Should return 404.', () => {
    return request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', accessToken)
      .send({ password: 'newsuperpass' })
      .expect(404);
  });

  it('DELETE /users Should return 404.', () => {
    return request(app.getHttpServer())
      .delete('/users')
      .set('Authorization', accessToken)
      .send()
      .expect(404);
  });

  afterAll(async () => {
    try {
      await userService.remove(user.email);
    } catch (err) {}
    await app.close();
  });
});
