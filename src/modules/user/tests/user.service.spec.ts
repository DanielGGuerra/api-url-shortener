import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { DatabaseService } from '../../../database/database.service';
import { hashPassword } from '../../../common/utils';

jest.mock('../../../common/utils', () => ({
  hashPassword: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;

  const databaseMock = {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: databaseMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      const expectedUser = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      databaseMock.user.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(hashPassword).toHaveBeenCalledWith(createUserDto.password);
      expect(databaseMock.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const expectedUser = {
        id: 1,
        email,
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      databaseMock.user.findFirst.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);

      expect(result).toEqual(expectedUser);
      expect(databaseMock.user.findFirst).toHaveBeenCalledWith({
        where: {
          email,
          deletedAt: null,
        },
      });
    });

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@example.com';

      databaseMock.user.findFirst.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
      expect(databaseMock.user.findFirst).toHaveBeenCalledWith({
        where: {
          email,
          deletedAt: null,
        },
      });
    });
  });
});
