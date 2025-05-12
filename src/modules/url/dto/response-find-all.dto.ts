import { Url } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { ResponseCreateDTO } from './response-create.dto';

export class ResponseFindAllDTO {
  @Expose()
  @Type(() => ResponseCreateDTO)
  data: ResponseCreateDTO[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  totalPages: number;

  constructor(data: Url[], total: number, page: number) {
    this.data = data.map((url) => new ResponseCreateDTO(url));
    this.total = total;
    this.page = page;
    this.totalPages = Math.ceil(total / page);
  }
}
