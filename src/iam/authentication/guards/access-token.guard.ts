import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_USER_KEY } from '../../iam.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigrations: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException(
        'where is your token, please login again',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfigrations.secret,
        issuer: this.jwtConfigrations.issuer,
        audience: this.jwtConfigrations.audience,
      });
      request[REQUEST_USER_KEY] = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('token invalid, login again');
    }
  }

  private extractTokenFromCookie(request: Request) {
    const token = request.cookies['accessToken'];
    if (!token) {
      return false;
    }
    return token;
  }
}
