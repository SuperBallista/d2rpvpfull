import { Test, TestingModule } from '@nestjs/testing';
import { GetNicknameService } from './get-nickname.service';

describe('GetNicknameService', () => {
  let service: GetNicknameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetNicknameService],
    }).compile();

    service = module.get<GetNicknameService>(GetNicknameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
