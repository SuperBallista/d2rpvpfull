import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, JwtService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
