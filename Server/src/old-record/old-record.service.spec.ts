import { Test, TestingModule } from '@nestjs/testing';
import { OldRecordService } from './old-record.service';

describe('OldRecordService', () => {
  let service: OldRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OldRecordService],
    }).compile();

    service = module.get<OldRecordService>(OldRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
