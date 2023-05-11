import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {ConflictException, HttpStatus, NotFoundException, Request} from "@nestjs/common";
import * as httpMock from 'node-mocks-http'
import {UserEntity} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

describe('UsersController', () => {
  let controller: UserController;
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).useMocker((token) => {
      if (token == UserService) {
        return {
          create: jest.fn()
              .mockResolvedValueOnce({ email: 'anna@mail.ru' })
              .mockImplementationOnce(() => { throw new ConflictException() }),
          findOne: jest.fn()
              .mockResolvedValueOnce({ email: 'anna@mail.ru' })
              .mockImplementationOnce(() => { throw new NotFoundException() }),
          update: jest.fn()
              .mockResolvedValueOnce({ email: 'anna@mail.ru' })
              .mockImplementationOnce(() => { throw new NotFoundException() }),
          remove: jest.fn()
              .mockResolvedValueOnce(HttpStatus.OK)
              .mockImplementationOnce(() => { throw new NotFoundException() })
        }
      }
    })
        .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('Should be defined.', () => {
    expect(controller).toBeDefined();
    expect(UserService).toBeDefined();
  });

  describe('/user', () => {
    it('POST. Should return created user credentials.', async () => {
      expect(await controller.create(new CreateUserDto('anna@mail.ru', 'superpass')))
          .toStrictEqual(new UserEntity({ email: 'anna@mail.ru' }));
    })

    it('POST. Should throw ConflictErrorException', async () => {
      await expect(controller.create(new CreateUserDto('anna@mail.ru', 'superpass')))
          .rejects.toThrow(ConflictException);
    })

    it('GET. Should return found user credentials.', async () => {
      let req = httpMock.createRequest({
        user: {
          email: 'anna@mail.ru'
        }
      });
      expect(await controller.findOne(req)).toStrictEqual(new UserEntity({ email: 'anna@mail.ru' }));
    })

    it('GET. Should throw ConflictErrorException.', async () => {
      let req = httpMock.createRequest({
        user: {
          email: 'notExisting@mail.ru'
        }
      });
      await expect(controller.findOne(req)).rejects.toThrow(NotFoundException);
    })

    it('PATCH. Should return updated user credentials.', async () => {
      let req = httpMock.createRequest({
        user: {
          email: 'anna@mail.ru'
        }
      });
      expect(await controller.update(req, new UpdateUserDto({ password: 'newsuperpass' })))
          .toStrictEqual(new UserEntity({ email: 'anna@mail.ru' }));
    })

    it('PATCH. Should throw NotFoundException.', async () => {
      let req = httpMock.createRequest({
        user: {
          email: 'anna@mail.ru'
        }
      });
      await expect(controller.update(req, new UpdateUserDto({ password: 'newsuperpass' })))
          .rejects.toThrow(NotFoundException);
    })

    it('DELETE. Should return OK status response.', async () => {
      let req = httpMock.createRequest({
        user: {
          email: 'anna@mail.ru'
        }
      });
      expect(await controller.remove(req)).toBe(HttpStatus.OK);
    })

    it('DELETE. Should throw NotFoundException.', async () => {
      let req = httpMock.createRequest({
        user: {
          email: 'anna@mail.ru'
        }
      });
      await expect(controller.remove(req)).rejects.toThrow(NotFoundException);
    })
  })
});
