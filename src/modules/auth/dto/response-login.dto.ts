import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseCreateUserDto } from '../../user/dto/response-create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @Expose()
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @Expose()
  @ApiProperty({
    description: 'User',
    type: ResponseCreateUserDto,
  })
  @Type(() => ResponseCreateUserDto)
  user: ResponseCreateUserDto;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
