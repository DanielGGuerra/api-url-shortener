import { Test } from '@nestjs/testing';
import { UrlController } from '../url.controller';
import { UrlService } from '../url.service';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';

describe('UrlController', () => {
  let urlController: UrlController;

  const urlServiceMock = {
    findOriginalURLByShortenedCode: jest.fn(),
    create: jest.fn(),
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
});
