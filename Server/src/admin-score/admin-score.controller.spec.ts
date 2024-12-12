import { Test, TestingModule } from '@nestjs/testing';
import { AdminScoreController } from './admin-score.controller';

describe('AdminScoreController', () => {
  let controller: AdminScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminScoreController],
    }).compile();

    controller = module.get<AdminScoreController>(AdminScoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
