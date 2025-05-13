import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'ola@danielgguerra.dev',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  password: string;
}
