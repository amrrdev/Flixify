import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enum/auth-type.enum';
import { SerializeInterceptor } from './interceptors/serialize.interceptor';
import { Users } from '@prisma/client';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
@Auth(AuthType.NONE)
@UseInterceptors(SerializeInterceptor<Users>)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.signup(signUpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() singInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.authenticationService.login(singInDto);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 48),
    });
    return {
      message: 'Login successful',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body('email') email: string) {
    return this.authenticationService.resetPassword(email);
  }

  @Post('change-password')
  changePassword(
    @Query('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authenticationService.changePassword(token, password);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authenticationService.refreshToken(refreshTokenDto);
  }
}
