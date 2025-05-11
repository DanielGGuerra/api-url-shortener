import { Url } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class ResponseCreateDTO implements Url {
  @Exclude()
  id: number;

  @Expose({ name: 'id' })
  externalId: string;

  @Expose()
  original: string;

  @Expose()
  shortened: string;

  @Expose()
  shortenedUrl: string;

  @Expose()
  clicks: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date | null;

  @Exclude()
  deletedAt: Date | null;

  constructor(params: Url) {
    Object.keys(this).forEach((prop) => {
      this[prop] = params[prop];
    });
    this.shortenedUrl = `${process.env.BASE_URL}/${this.shortened}`;
  }
}
