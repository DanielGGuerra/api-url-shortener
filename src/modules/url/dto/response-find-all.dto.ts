import { Url } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { ResponseCreateDTO } from './response-create.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseFindAllDTO {
  @Expose()
  @Type(() => ResponseCreateDTO)
  @ApiProperty({
    description: 'URLs',
    type: ResponseCreateDTO,
    isArray: true,
  })
  data: ResponseCreateDTO[];

  @Expose()
  @ApiProperty({
    description: 'Total of URLs',
    example: 100,
  })
  total: number;

  @Expose()
  @ApiProperty({
    description: 'Current page',
    example: 1,
  })
  page: number;

  @Expose()
  @ApiProperty({
    description: 'Total of pages',
    example: 10,
  })
  totalPages: number;

  constructor(data: Url[], total: number, page: number) {
    this.data = data.map((url) => new ResponseCreateDTO(url));
    this.total = total;
    this.page = page;
    this.totalPages = Math.ceil(total / page);
  }
}
