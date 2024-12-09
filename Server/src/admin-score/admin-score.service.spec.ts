import { Test, TestingModule } from '@nestjs/testing';
import { AdminScoreService } from './admin-score.service';

describe('AdminScoreService', () => {
  let service: AdminScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminScoreService],
    }).compile();

    service = module.get<AdminScoreService>(AdminScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
