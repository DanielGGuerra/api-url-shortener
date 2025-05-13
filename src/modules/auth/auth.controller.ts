import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/response-login.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { LocalGuard } from './guards/local.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiOperation({
    summary: 'Login',
    description: 'Login',
  })
  @ApiResponse({
    status: 201,
    description: 'Login',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  async login(
    @Body() _: LoginDto,
    @GetUser() user: User,
  ): Promise<LoginResponseDto> {
    const loginResponse = await this.authService.login(user);
    return new LoginResponseDto(loginResponse);
  }
}
