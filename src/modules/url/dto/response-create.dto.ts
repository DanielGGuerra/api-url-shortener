import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Url } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class ResponseCreateDTO implements Url {
  @Exclude()
  @ApiHideProperty()
  id: number;

  @Expose({ name: 'id' })
  @ApiProperty({
    description: 'URL id',
    example: 'abc123',
    name: 'id',
  })
  externalId: string;

  @Expose()
  @ApiProperty({
    description: 'Original URL',
    example: 'https://www.danielgguerra.dev',
    name: 'original',
  })
  original: string;

  @Expose()
  @ApiProperty({
    description: 'Shortened URL',
    example: 'abc123',
  })
  shortened: string;

  @Expose()
  @ApiProperty({
    description: 'Shortened URL',
    example: 'https://short.url/abc123',
  })
  shortenedUrl: string;

  @Expose()
  @ApiProperty({
    description: 'Number of clicks',
    example: 100,
  })
  clicks: number;

  @Exclude()
  @ApiHideProperty()
  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt: Date | null;

  @Exclude()
  @ApiHideProperty()
  deletedAt: Date | null;

  @Exclude()
  @ApiHideProperty()
  userId: number | null;

  constructor(params: Url) {
    Object.keys(this).forEach((prop) => {
      this[prop] = params[prop];
    });
    this.shortenedUrl = `${process.env.BASE_URL}/${this.shortened}`;
  }
}
