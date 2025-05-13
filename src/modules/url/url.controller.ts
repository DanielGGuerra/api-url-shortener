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
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('')
@ApiTags('URLs')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get('/:shortenedCode')
  @ApiOperation({
    summary: 'Redirect to original page',
    description: 'Redirect to original page',
  })
  @ApiResponse({
    status: 307,
    description: 'Redirect to original page',
  })
  @ApiNotFoundResponse({
    example: {
      statusCode: 404,
      message: 'URL not found',
    },
  })
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
  @ApiOperation({
    summary: 'Create a new URL',
    description: 'Create a new URL',
  })
  @ApiResponse({
    status: 201,
    description: 'Create a new URL',
    type: ResponseCreateDTO,
    headers: {
      Authorization: {
        description: 'Bearer token',
        example: 'Bearer token',
      },
    },
  })
  @ApiBearerAuth('Authorization')
  async create(
    @Body() dto: CreateUrlDTO,
    @GetUser() user: User | null,
  ): Promise<ResponseCreateDTO> {
    const shortenedUrl = await this.urlService.create(dto, user);
    return new ResponseCreateDTO(shortenedUrl);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all URLs',
    description: 'Get all URLs',
  })
  @ApiBearerAuth('Authorization')
  @ApiResponse({
    status: 200,
    description: 'Get all URLs',
    type: ResponseFindAllDTO,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit of URLs per page',
    example: 10,
    required: false,
  })
  @ApiUnauthorizedResponse({
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
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

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Update a URL',
    description: 'Update a URL',
  })
  @ApiResponse({
    status: 201,
    description: 'Update a URL',
    type: ResponseCreateDTO,
  })
  @ApiParam({
    name: 'id',
    description: 'URL id',
    example: 'abc123',
  })
  @ApiUnauthorizedResponse({
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUrlDTO,
    @GetUser() user: User,
  ) {
    const updated = await this.urlService.update(id, dto, user);
    return new ResponseCreateDTO(updated);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Delete a URL',
    description: 'Delete a URL',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete a URL',
  })
  @ApiParam({
    name: 'id',
    description: 'URL id',
    example: 'abc123',
  })
  @ApiUnauthorizedResponse({
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  async delete(@Param('id') id: string, @GetUser() user: User) {
    await this.urlService.delete(id, user);
  }
}
