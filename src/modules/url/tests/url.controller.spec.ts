import { Test } from '@nestjs/testing';
import { UrlController } from '../url.controller';
import { UrlService } from '../url.service';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';
import { ResponseCreateDTO } from '../dto/response-create.dto';

describe('UrlController', () => {
  let urlController: UrlController;

  const urlServiceMock = {
    findOriginalURLByShortenedCode: jest.fn(),
    create: jest.fn(),
    incrementClicks: jest.fn(),
  };

  const responseMock = {
    redirect: jest.fn(),
  } as unknown as Response;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UrlService,
          useValue: urlServiceMock,
        },
      ],
      controllers: [UrlController],
    }).compile();

    urlController = module.get(UrlController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('redirectToOriginalPage', () => {
    it('should redirect page with exists original url', async () => {
      const shortenedCode = 'valid_shortened_code';
      const validOriginalUrl = 'valid_original_url';

      urlServiceMock.findOriginalURLByShortenedCode.mockReturnValue(
        validOriginalUrl,
      );
      const responseSpy = jest.spyOn(responseMock, 'redirect');

      await urlController.redirectToOriginalPage(shortenedCode, responseMock);

      expect(
        urlServiceMock.findOriginalURLByShortenedCode,
      ).toHaveBeenCalledTimes(1);
      expect(
        urlServiceMock.findOriginalURLByShortenedCode,
      ).toHaveBeenCalledWith(shortenedCode);
      expect(urlServiceMock.findOriginalURLByShortenedCode).toHaveReturnedWith(
        validOriginalUrl,
      );

      expect(responseSpy).toHaveBeenCalledWith(validOriginalUrl);
      expect(urlServiceMock.incrementClicks).toHaveBeenCalledTimes(1);
      expect(urlServiceMock.incrementClicks).toHaveBeenCalledWith(
        shortenedCode,
      );
    });

    it('should throw error of "not found" if not exists original url', async () => {
      const shortenedCode = 'invalid_shortened_code';
      const originalUrl = null;

      urlServiceMock.findOriginalURLByShortenedCode.mockReturnValue(
        originalUrl,
      );
      const responseSpy = jest.spyOn(responseMock, 'redirect');

      const promise = urlController.redirectToOriginalPage(
        shortenedCode,
        responseMock,
      );

      await expect(promise).rejects.toThrow(new NotFoundException());
      expect(
        urlServiceMock.findOriginalURLByShortenedCode,
      ).toHaveBeenCalledTimes(1);
      expect(
        urlServiceMock.findOriginalURLByShortenedCode,
      ).toHaveBeenCalledWith(shortenedCode);
      expect(urlServiceMock.findOriginalURLByShortenedCode).toHaveReturnedWith(
        originalUrl,
      );
      expect(responseSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('create', () => {
    it('should create a new shortened URL without user', async () => {
      const originalUrl = 'https://example.com';
      const urlResponse = {
        id: 1,
        externalId: 'valid_external_id',
        original: originalUrl,
        shortened: 'abc123',
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      urlServiceMock.create.mockReturnValue(urlResponse);

      const result = await urlController.create({ url: originalUrl }, null);

      expect(urlServiceMock.create).toHaveBeenCalledTimes(1);
      expect(urlServiceMock.create).toHaveBeenCalledWith(
        { url: originalUrl },
        null,
      );
      expect(result).toBeInstanceOf(ResponseCreateDTO);
      expect(result).toEqual({
        id: urlResponse.id,
        externalId: urlResponse.externalId,
        original: urlResponse.original,
        shortened: urlResponse.shortened,
        shortenedUrl: `${process.env.BASE_URL}/${urlResponse.shortened}`,
        createdAt: urlResponse.createdAt,
        updatedAt: urlResponse.updatedAt,
        deletedAt: urlResponse.deletedAt,
        userId: urlResponse.userId,
      });
    });

    it('should create a new shortened URL with user', async () => {
      const originalUrl = 'https://example.com';
      const user = {
        id: 1,
        externalId: 'user_external_id',
        email: 'test@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      const urlResponse = {
        id: 1,
        externalId: 'valid_external_id',
        original: originalUrl,
        shortened: 'abc123',
        userId: user.id,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };

      urlServiceMock.create.mockReturnValue(urlResponse);

      const result = await urlController.create({ url: originalUrl }, user);

      expect(urlServiceMock.create).toHaveBeenCalledTimes(1);
      expect(urlServiceMock.create).toHaveBeenCalledWith(
        { url: originalUrl },
        user,
      );
      expect(result).toBeInstanceOf(ResponseCreateDTO);
      expect(result).toEqual({
        id: urlResponse.id,
        externalId: urlResponse.externalId,
        original: urlResponse.original,
        shortened: urlResponse.shortened,
        shortenedUrl: `${process.env.BASE_URL}/${urlResponse.shortened}`,
        createdAt: urlResponse.createdAt,
        updatedAt: urlResponse.updatedAt,
        deletedAt: urlResponse.deletedAt,
        userId: urlResponse.userId,
      });
    });
  });
});
