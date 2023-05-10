import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as process from 'process';
import { CreateUserDto } from './dto/create-user.dto';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('create', () => {
    it('Should return created object.', async () => {
      const expectedUser = {
        email: 'anna@mail.ru',
        role: 'User',
        passwordHash: await bcrypt.hash('superpass', +process.env.BCRYPT_SALTORROUNDS),
        isActivated: false,
        activationLink: null,
      };
      expect(
        await service.create(new CreateUserDto('anna@mail.ru', 'superpass')),
      ).toStrictEqual(expectedUser);
    });
  });

});
