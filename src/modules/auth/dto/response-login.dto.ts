import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseCreateUserDto } from '../../user/dto/response-create-user.dto';

export class LoginResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  @Type(() => ResponseCreateUserDto)
  user: ResponseCreateUserDto;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
