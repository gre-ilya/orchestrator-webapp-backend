import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshController } from './jwt-refresh.controller';

describe('JwtRefreshController', () => {
  let controller: JwtRefreshController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JwtRefreshController],
    }).compile();

    controller = module.get<JwtRefreshController>(JwtRefreshController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
