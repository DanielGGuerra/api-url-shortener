import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

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
    findByExternalId: jest.fn().mockResolvedValue(mockUser),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  let mockExecutionContext: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        JwtAuthGuard,
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

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);

    const token = jwtService.sign({
      sub: mockUser.externalId,
      email: mockUser.email,
    });

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }),
      }),
    } as ExecutionContext;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when token is valid', async () => {
      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
      expect(mockUserService.findByExternalId).toHaveBeenCalledWith(
        mockUser.externalId,
      );
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const invalidContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer invalid-token',
            },
          }),
          getResponse: () => ({
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          }),
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(invalidContext)).rejects.toThrow(
        'Unauthorized',
      );
    });

    it('should throw UnauthorizedException when no token is provided', async () => {
      const noTokenContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
          getResponse: () => ({
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          }),
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(noTokenContext)).rejects.toThrow(
        'Unauthorized',
      );
    });
  });
});
