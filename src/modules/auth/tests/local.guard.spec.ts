import { Test, TestingModule } from '@nestjs/testing';
import { LocalGuard } from '../guards/local.guard';
import { AuthService } from '../auth.service';
import { ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../strategies/local.strategy';

describe('LocalGuard', () => {
  let guard: LocalGuard;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        body: {
          email: 'test@example.com',
          password: 'password',
        },
      }),
      getResponse: () => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }),
    }),
  } as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule],
      providers: [
        LocalGuard,
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    guard = module.get<LocalGuard>(LocalGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when user is validated', async () => {
      const mockUser: User = {
        id: 1,
        externalId: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
    });

    it('should throw UnauthorizedException when user is not validated', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        'Unauthorized',
      );
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
    });
  });
});
