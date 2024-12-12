import { Test, TestingModule } from '@nestjs/testing';
import { OldRecordController } from './old-record.controller';

describe('OldRecordController', () => {
  let controller: OldRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OldRecordController],
    }).compile();

    controller = module.get<OldRecordController>(OldRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
