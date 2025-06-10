import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistedTokenService } from './blacklisted-token.service';

describe('BlacklistedTokenService', () => {
  let service: BlacklistedTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlacklistedTokenService],
    }).compile();

    service = module.get<BlacklistedTokenService>(BlacklistedTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
