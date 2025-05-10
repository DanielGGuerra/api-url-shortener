import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateUrlDTO } from './dto/create-url.dto';
import { Url } from '@prisma/client';
import nanoId from '../../common/utils/nano-id';

@Injectable()
export class UrlService {
  constructor(private readonly database: DatabaseService) {}

  async findOriginalURLByShortenedCode(code: string): Promise<string | null> {
    const url = await this.database.url.findUnique({
      where: { shortened: code },
    });

    if (!url) return null;

    return url.original;
  }

  async create(dto: CreateUrlDTO): Promise<Url> {
    const shortenedCode = nanoId();

    const shortenedUrl = await this.database.url.create({
      data: {
        original: dto.url,
        shortened: shortenedCode,
      },
    });

    return shortenedUrl;
  }
}
