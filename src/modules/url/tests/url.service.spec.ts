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
        },
      });
    });
  });

  describe('create', () => {
    it('should return url after create', async () => {
      const dto = {
        url: 'valid_original_url',
      };

      const newUrl: Url = {
        id: 1,
        externalId: 'valid_external_id',
        original: 'valid_original_url',
        shortened: 'valid_shortened',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      (generateCode as jest.Mock).mockReturnValue(newUrl.shortened);
      databaseMock.url.create.mockResolvedValue(newUrl);

      const result = await urlService.create(dto);

      expect(result).toEqual(newUrl);
      expect(result.original).toBe(dto.url);
      expect(databaseMock.url.create).toHaveBeenCalledTimes(1);
      expect(databaseMock.url.create).toHaveBeenCalledWith({
        data: {
          original: dto.url,
          shortened: newUrl.shortened,
        },
      });
    });
  });
});
