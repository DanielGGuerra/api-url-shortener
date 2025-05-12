import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockUser: User = {
    id: 1,
    externalId: '123',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockUserService = {
    findByExternalId: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when payload is valid', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234567890,
      };

      mockUserService.findByExternalId.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(mockUserService.findByExternalId).toHaveBeenCalledWith('123');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234567890,
      };

      mockUserService.findByExternalId.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.findByExternalId).toHaveBeenCalledWith('123');
    });
  });
});
