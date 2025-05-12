import { Test } from '@nestjs/testing';
import { UrlService } from '../url.service';
import { DatabaseService } from '../../../database/database.service';
import { Url } from '@prisma/client';
import { generateCode } from '../../../common/utils';

jest.mock('../../../common/utils', () => ({
  generateCode: jest.fn(),
}));

describe('UrlService', () => {
  const databaseMock = {
    url: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  let urlService: UrlService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: DatabaseService,
          useValue: databaseMock,
        },
        UrlService,
      ],
    }).compile();

    urlService = module.get(UrlService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findOriginalURLByShortenedCode', () => {
    it('should return original url if exists', async () => {
      const urlExists: Url = {
        id: 1,
        externalId: 'valid_external_id',
        original: 'valid_original_url',
        shortened: 'valid_shortened',
        clicks: 0,
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      databaseMock.url.findUnique.mockResolvedValue(urlExists);

      const result = await urlService.findOriginalURLByShortenedCode(
        urlExists.shortened,
      );

      expect(result).toEqual(urlExists.original);
      expect(databaseMock.url.findUnique).toHaveBeenCalledTimes(1);
      expect(databaseMock.url.findUnique).toHaveBeenCalledWith({
        where: {
          shortened: urlExists.shortened,
          deletedAt: null,
        },
      });
    });

    it('should return null if url is deleted', async () => {
      const urlExists: Url = {
        id: 1,
        externalId: 'valid_external_id',
        original: 'valid_original_url',
        shortened: 'valid_shortened',
        clicks: 0,
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: new Date(),
      };

      databaseMock.url.findUnique.mockResolvedValue(null);

      const result = await urlService.findOriginalURLByShortenedCode(
        urlExists.shortened,
      );

      expect(result).toEqual(null);
      expect(databaseMock.url.findUnique).toHaveBeenCalledTimes(1);
      expect(databaseMock.url.findUnique).toHaveBeenCalledWith({
        where: {
          shortened: urlExists.shortened,
          deletedAt: null,
        },
      });
    });

    it('should return null if not exists', async () => {
      databaseMock.url.findUnique.mockResolvedValue(null);

      const code = 'not_exists_shortened_code';

      const result = await urlService.findOriginalURLByShortenedCode(code);

      expect(result).toEqual(null);
      expect(databaseMock.url.findUnique).toHaveBeenCalledTimes(1);
      expect(databaseMock.url.findUnique).toHaveBeenLastCalledWith({
        where: {
          shortened: code,
          deletedAt: null,
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new URL without user', async () => {
      const dto = {
        url: 'valid_original_url',
      };

      const newUrl: Url = {
        id: 1,
        externalId: 'valid_external_id',
        original: 'valid_original_url',
        shortened: 'valid_shortened',
        clicks: 0,
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      (generateCode as jest.Mock).mockReturnValue(newUrl.shortened);
      databaseMock.url.create.mockResolvedValue(newUrl);

      const result = await urlService.create(dto, null);

      expect(result).toEqual(newUrl);
      expect(result.original).toBe(dto.url);
      expect(databaseMock.url.create).toHaveBeenCalledTimes(1);
      expect(databaseMock.url.create).toHaveBeenCalledWith({
        data: {
          original: dto.url,
          shortened: newUrl.shortened,
          userId: null,
        },
      });
    });

    it('should create a new URL with user', async () => {
      const dto = {
        url: 'valid_original_url',
      };

      const user = {
        id: 1,
        externalId: 'user_external_id',
        email: 'test@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      const newUrl: Url = {
        id: 1,
        externalId: 'valid_external_id',
        original: 'valid_original_url',
        shortened: 'valid_shortened',
        clicks: 0,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      (generateCode as jest.Mock).mockReturnValue(newUrl.shortened);
      databaseMock.url.create.mockResolvedValue(newUrl);

      const result = await urlService.create(dto, user);

      expect(result).toEqual(newUrl);
      expect(result.original).toBe(dto.url);
      expect(result.userId).toBe(user.id);
      expect(databaseMock.url.create).toHaveBeenCalledTimes(1);
      expect(databaseMock.url.create).toHaveBeenCalledWith({
        data: {
          original: dto.url,
          shortened: newUrl.shortened,
          userId: user.id,
        },
      });
    });
  });

  describe('incrementClicks', () => {
    it('should increment url click counter', async () => {
      const code = 'valid_shortened_code';

      await urlService.incrementClicks(code);

      expect(databaseMock.url.update).toHaveBeenCalledTimes(1);
      expect(databaseMock.url.update).toHaveBeenCalledWith({
        where: { shortened: code },
        data: { clicks: { increment: 1 } },
      });
    });
  });
});
