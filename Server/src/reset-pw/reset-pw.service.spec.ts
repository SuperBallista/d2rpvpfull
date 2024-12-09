import { Test, TestingModule } from '@nestjs/testing';
import { ResetPwService } from './reset-pw.service';

describe('ResetPwService', () => {
  let service: ResetPwService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetPwService],
    }).compile();

    service = module.get<ResetPwService>(ResetPwService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
