import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDTO } from './dto/create-url.dto';
import { ResponseCreateDTO } from './dto/response-create.dto';
import { Response } from 'express';

@Controller('')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get('/:shortenedCode')
  async redirectToOriginalPage(
    @Param('shortenedCode') shortenedCode: string,
    @Res() response: Response,
  ): Promise<void> {
    const url =
      await this.urlService.findOriginalURLByShortenedCode(shortenedCode);

    if (!url) throw new NotFoundException();

    response.redirect(url);

    await this.urlService.incrementClicks(shortenedCode);
  }

  @Post()
  async create(@Body() dto: CreateUrlDTO): Promise<ResponseCreateDTO> {
    const shortenedUrl = await this.urlService.create(dto);
    return new ResponseCreateDTO(shortenedUrl);
  }
}
