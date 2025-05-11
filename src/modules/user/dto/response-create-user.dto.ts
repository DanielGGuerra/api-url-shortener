import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class ResponseCreateUserDto implements User {
  @Exclude()
  id: number;

  @Expose({ name: 'id' })
  externalId: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date | null;

  @Exclude()
  deletedAt: Date | null;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
