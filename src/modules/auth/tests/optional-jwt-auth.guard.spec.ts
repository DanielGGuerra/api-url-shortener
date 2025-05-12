import { Test, TestingModule } from '@nestjs/testing';
import { OptionalJwtAuthGuard } from '../guards/optional-jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OptionalJwtStrategy } from '../strategies/optional-jwt.strategy';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('OptionalJwtAuthGuard', () => {
  let guard: OptionalJwtAuthGuard;
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
  let request: { headers: { authorization?: string }; user?: User };

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
        OptionalJwtAuthGuard,
        OptionalJwtStrategy,
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

    guard = module.get<OptionalJwtAuthGuard>(OptionalJwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);

    const token = jwtService.sign({
      sub: mockUser.externalId,
      email: mockUser.email,
    });

    request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
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
    it('should return true and set user on request when token is valid', async () => {
      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
      expect(request.user).toEqual(mockUser);
      expect(mockUserService.findByExternalId).toHaveBeenCalledWith(
        mockUser.externalId,
      );
    });

    it('should return false when token is invalid', async () => {
      request.headers.authorization = 'Bearer invalid-token';
      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });

    it('should return true and set user as null when no token is provided', async () => {
      request.headers = {};
      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
      expect(request.user).toBeNull();
    });

    it('should return false when user is not found', async () => {
      mockUserService.findByExternalId.mockResolvedValueOnce(null);
      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });
  });
});
