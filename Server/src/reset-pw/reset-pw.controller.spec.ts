import { Test, TestingModule } from '@nestjs/testing';
import { ResetPwController } from './reset-pw.controller';

describe('ResetPwController', () => {
  let controller: ResetPwController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPwController],
    }).compile();

    controller = module.get<ResetPwController>(ResetPwController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
