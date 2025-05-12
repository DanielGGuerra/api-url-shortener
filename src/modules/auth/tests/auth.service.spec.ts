import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { comparePasswords } from '../../../common/utils';

jest.mock('../../../common/utils', () => ({
  comparePasswords: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;

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
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password';

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (comparePasswords as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(email, password);

      expect(result).toEqual(mockUser);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(comparePasswords).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
    });

    it('should return null when user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password';

      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(comparePasswords).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'invalid-password';

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (comparePasswords as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(comparePasswords).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
    });
  });

  describe('login', () => {
    it('should return login response with tokens', async () => {
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockConfigService.getOrThrow.mockImplementation((key: string) => {
        switch (key) {
          case 'JWT_SECRET':
            return 'secret';
          case 'JWT_EXPIRATION':
            return '1h';
          case 'JWT_REFRESH_SECRET':
            return 'refresh-secret';
          case 'JWT_REFRESH_EXPIRATION':
            return '7d';
          default:
            return '';
        }
      });

      mockJwtService.signAsync.mockResolvedValueOnce(mockTokens.accessToken);
      mockJwtService.signAsync.mockResolvedValueOnce(mockTokens.refreshToken);

      const result = await authService.login(mockUser);

      expect(result).toEqual({
        ...mockTokens,
        user: mockUser,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });
});
