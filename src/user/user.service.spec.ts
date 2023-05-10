import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as process from 'process';
import { CreateUserDto } from './dto/create-user.dto';
import {ConflictException} from "@nestjs/common";

describe('UsersService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();
    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { email: 'anna@mail.ru' } })
  })

  it('Should be defined.', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('create', () => {
    it('Should return created object.', async () => {
      const createdUserPassword = 'superpass';
      const expectedUser = {
        email: 'anna@mail.ru',
        role: 'User',
        passwordHash: expect.any(String),
        isActivated: false,
        activationLink: null,
      };
      const returnedValue = await service.create(new CreateUserDto('anna@mail.ru', createdUserPassword));
      expect(returnedValue).toStrictEqual(expectedUser);
      expect(bcrypt.compare(createdUserPassword, returnedValue.passwordHash)).toBeTruthy();
    });

    it('Should throw ConflictException.', async () => {
      await expect(service.create(new CreateUserDto('anna@mail.ru', 'superpass'))).rejects.toThrow(ConflictException);
    })
  });

});
