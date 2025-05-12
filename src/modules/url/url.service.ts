import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateUrlDTO } from './dto/create-url.dto';
import { Url, User } from '@prisma/client';
import { generateCode } from '../../common/utils';

@Injectable()
export class UrlService {
  constructor(private readonly database: DatabaseService) {}

  async findOriginalURLByShortenedCode(code: string): Promise<string | null> {
    const url = await this.database.url.findUnique({
      where: { shortened: code, deletedAt: null },
    });

    if (!url) return null;

    return url.original;
  }

  async create(dto: CreateUrlDTO, user: User | null): Promise<Url> {
    const shortenedCode = generateCode();

    const shortenedUrl = await this.database.url.create({
      data: {
        original: dto.url,
        shortened: shortenedCode,
        userId: user?.id || null,
      },
    });

    return shortenedUrl;
  }

  async incrementClicks(code: string): Promise<void> {
    await this.database.url.update({
      where: { shortened: code },
      data: { clicks: { increment: 1 } },
    });
  }
}
