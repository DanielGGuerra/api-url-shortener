import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseCreateUserDto } from './dto/response-create-user.dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'Create a new user',
    type: ResponseCreateUserDto,
  })
  @ApiBadRequestResponse({
    example: {
      statusCode: 400,
      message: 'E-mail already exists',
    },
  })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseCreateUserDto> {
    const user = await this.userService.create(createUserDto);
    return new ResponseCreateUserDto(user);
  }
}
