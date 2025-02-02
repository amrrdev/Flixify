import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enum/auth-type.enum';

@Controller('auth')
@Auth(AuthType.NONE)
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
}
