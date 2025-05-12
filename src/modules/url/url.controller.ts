import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseFindAllDTO } from './dto/response-find-all.dto';
import { UpdateUrlDTO } from './dto/update-url.dto';

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

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @GetUser() user: User,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    const take = limit;
    const skip = (page - 1) * limit;

    const { data, total } = await this.urlService.findAll(user, take, skip);

    return new ResponseFindAllDTO(data, total, page);
  }

  @Patch('/:shortenedCode')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('shortenedCode') shortenedCode: string,
    @Body() dto: UpdateUrlDTO,
    @GetUser() user: User,
  ) {
    const updated = await this.urlService.update(shortenedCode, dto, user);
    return new ResponseCreateDTO(updated);
  }

  @Delete('/:shortenedCode')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('shortenedCode') shortenedCode: string,
    @GetUser() user: User,
  ) {
    await this.urlService.delete(shortenedCode, user);
  }
}
