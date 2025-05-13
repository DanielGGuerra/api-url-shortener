import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class ResponseCreateUserDto implements User {
  @Exclude()
  @ApiHideProperty()
  id: number;

  @Expose({ name: 'id' })
  @ApiProperty({
    description: 'User id',
    example: 'eyJhbGciOi...',
    name: 'id',
  })
  externalId: string;

  @Expose()
  @ApiProperty({
    description: 'User email',
    example: 'ola@danielgguerra.dev',
  })
  email: string;

  @Exclude()
  @ApiHideProperty()
  password: string;

  @Exclude()
  @ApiHideProperty()
  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt: Date | null;

  @Exclude()
  @ApiHideProperty()
  deletedAt: Date | null;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
