import { Test, TestingModule } from '@nestjs/testing';
import { GetNicknameController } from './get-nickname.controller';

describe('GetNicknameController', () => {
  let controller: GetNicknameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetNicknameController],
    }).compile();

    controller = module.get<GetNicknameController>(GetNicknameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
