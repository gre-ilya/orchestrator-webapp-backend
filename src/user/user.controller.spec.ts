import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {PrismaModule} from "../prisma/prisma.module";
import {ConflictException, HttpStatus, NotFoundException} from "@nestjs/common";

describe('UsersController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
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
              .mockImplementationOnce(() => { throw new ConflictException() }),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(UserService).toBeDefined();
  });
});
