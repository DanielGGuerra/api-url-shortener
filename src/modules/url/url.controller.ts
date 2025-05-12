import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDTO } from './dto/create-url.dto';
import { ResponseCreateDTO } from './dto/response-create.dto';
import { Response } from 'express';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

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
  @UseGuards(OptionalJwtAuthGuard)
  async create(
    @Body() dto: CreateUrlDTO,
    @GetUser() user: User | null,
  ): Promise<ResponseCreateDTO> {
    const shortenedUrl = await this.urlService.create(dto, user);
    return new ResponseCreateDTO(shortenedUrl);
  }
}
