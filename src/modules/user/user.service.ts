import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../../common/utils';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);

    const isEmailAlreadyExists = await this.findByEmail(createUserDto.email);

    if (isEmailAlreadyExists) {
      throw new BadRequestException('E-mail already exists');
    }

    const user = await this.database.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.database.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    return user;
  }

  async findByExternalId(externalId: string) {
    const user = await this.database.user.findUnique({
      where: {
        externalId,
        deletedAt: null,
      },
    });

    return user;
  }
}
