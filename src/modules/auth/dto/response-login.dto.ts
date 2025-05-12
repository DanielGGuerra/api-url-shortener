import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseCreateUserDto } from '../../user/dto/response-create-user.dto';

export class LoginResponseDto {
  @Exclude()
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
