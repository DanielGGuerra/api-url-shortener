import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDTO {
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    description: 'URL to be shortened',
    example: 'https://www.danielgguerra.dev',
  })
  url: string;
}
