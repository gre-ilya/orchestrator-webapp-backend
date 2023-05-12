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

describe('user (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let access_token;

  const test_user = {
    email: undefined,
    password: 'superpass',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    userService = moduleFixture.get<UserService>(UserService);
    let count = 0;
    while (true) {
      const test_email = `test${count}@mail.ru`;
      try {
        await userService.findOne(test_email);
      } catch (NotFoundException) {
        test_user.email = test_email;
        break;
      }
      count++;
    }
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
      .send({ email: test_user.email, password: 'shorttt' })
      .expect(400);
  });

  it('POST /users Should return 400 (wrong mail).', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'noemail', password: test_user.password })
      .expect(400);
  });

  it('POST /users Should return 201 and { email }.', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: test_user.email, password: test_user.password })
      .expect(201, { email: test_user.email });
  });

  it('POST /users Should return 409.', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: test_user.email, password: test_user.password })
      .expect(409);
  });

  it('POST /auth/login Should return 201 and { access_token, refresh_token }', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: test_user.email, password: test_user.password })
      .expect(201);

    access_token = `Bearer ${res.body.accessToken}`;
  });

  it('GET /users Should return 200 and { email }.', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', access_token)
      .expect(200, { email: test_user.email });
  });

  it('PATCH /users Should return 400 (short password).', () => {
    return request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', access_token)
      .send({ password: 'short' })
      .expect(400);
  });

  it('PATCH /users Should return 200 and { email } (password updated).', () => {
    return request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', access_token)
      .send({ password: 'newsuperpass' })
      .expect(200, { email: test_user.email });
  });

  it('POST /auth/login Should return 401 (auth with old password).', async () => {
    return  request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: test_user.email, password: test_user.password })
        .expect(401);
  });

  it('POST /auth/login Should return 201 (auth with new password).', async () => {
    return  request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: test_user.email, password: 'newsuperpass' })
        .expect(201);
  });

  it('DELETE /users Should return 200.', () => {
    return request(app.getHttpServer())
      .delete('/users')
      .set('Authorization', access_token)
      .send()
      .expect(200);
  });

  it('GET /users Should return 404.', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', access_token)
      .expect(404);
  });

  it('PATCH /users Should return 404.', () => {
    return request(app.getHttpServer())
      .patch('/users')
      .set('Authorization', access_token)
      .send({ password: 'newsuperpass' })
      .expect(404);
  });

  it('DELETE /users Should return 404.', () => {
    return request(app.getHttpServer())
      .delete('/users')
      .set('Authorization', access_token)
      .send()
      .expect(404);
  });

  afterAll(async () => {
    try {
      await userService.remove(test_user.email);
    } catch (err) {}
    await app.close();
  });
});
