import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as process from 'process';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
import { exploreApiProducesMetadata } from '@nestjs/swagger/dist/explorers/api-produces.explorer';
import { PrismaModule } from '../prisma/prisma.module';

describe('UsersService (integration)', () => {
  let service: UserService;
  let prisma: PrismaService;
  const test_user = {
    email: 'anna@mail.ru',
    password: 'superpass',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('Should be defined.', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('create', () => {
    it('Should return created object.', async () => {
      const expectedUser = {
        email: test_user.email,
        role: 'User',
        password: expect.any(String),
        isActivated: false,
        activationLink: null,
      };
      const returnedValue = await service.create(
        new CreateUserDto(test_user.email, test_user.password),
      );
      expect(returnedValue).toStrictEqual(expectedUser);
      expect(
        bcrypt.compare(test_user.password, returnedValue.password),
      ).toBeTruthy();
    });

    it('Should throw ConflictException.', async () => {
      await expect(
        service.create(new CreateUserDto(test_user.email, test_user.password)),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('Should return found object.', async () => {
      const expectedUser = {
        email: test_user.email,
        role: 'User',
        password: expect.any(String),
        isActivated: false,
        activationLink: null,
      };
      expect(await service.findOne(test_user.email)).toStrictEqual(
        expectedUser,
      );
    });

    it('Should throw NotFoundException.', async () => {
      await expect(service.findOne('vasya@mail.ru')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('Should update user credentials.', async () => {
      const activationLink = 'https://superlink.ru';
      const expectedUser = {
        email: test_user.email,
        role: UserRole.Admin,
        password: expect.any(String),
        isActivated: true,
        activationLink: activationLink,
      };
      expect(
        await service.update(
          test_user.email,
          new UpdateUserDto({
            role: UserRole.Admin,
            isActivated: true,
            activationLink: activationLink,
          }),
        ),
      ).toStrictEqual(expectedUser);
    });

    it('Should throw NotFoundException.', async () => {
      await expect(
        service.update(
          'vasya@mail.ru',
          new UpdateUserDto({
            password: 'superpass',
          }),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('Should remove user from database.', async () => {
      expect(await service.remove(test_user.email)).toBe(HttpStatus.OK);
    });
    it('Should throw NotFoundException.', async () => {
      await expect(service.remove(test_user.email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  afterAll(async () => {
    try {
      await service.remove(test_user.email);
    } catch (err) {}
  });
});
