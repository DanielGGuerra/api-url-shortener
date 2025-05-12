import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OptionalJwtStrategy } from '../strategies/optional-jwt.strategy';
import { User } from '@prisma/client';
import { UserService } from '../../user/user.service';

describe('OptionalJwtStrategy', () => {
  let strategy: OptionalJwtStrategy;

  const mockAuthService = {
    login: jest.fn(),
    findByExternalId: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    externalId: '123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionalJwtStrategy,
        {
          provide: UserService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<OptionalJwtStrategy>(OptionalJwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when valid payload is provided', async () => {
      const payload = { sub: '123', email: 'test@example.com' };

      mockAuthService.findByExternalId.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(mockAuthService.findByExternalId).toHaveBeenCalledWith(
        payload.sub,
      );
    });

    it('should return null when user is not found', async () => {
      const payload = { sub: '123', email: 'test@example.com' };
      mockAuthService.findByExternalId.mockResolvedValue(null);

      const result = await strategy.validate(payload);

      expect(result).toBeNull();
      expect(mockAuthService.findByExternalId).toHaveBeenCalledWith('123');
    });
  });
});
