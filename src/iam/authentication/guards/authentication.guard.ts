import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType } from '../enum/auth-type.enum';
import { AccessTokenGuard } from './access-token.guard';
import { AUTH_TYPE_KEY } from '../iam.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.BEARER;
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.BEARER]: this.accessTokenGuard,
    [AuthType.COOKIE]: this.accessTokenGuard,
    [AuthType.NONE]: { canActivate: () => true },
  };

  constructor(
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const authTypesArray = Array.isArray(authTypes) ? authTypes : [authTypes];

    const guards = authTypesArray
      .map((type) => this.authTypeGuardMap[type])
      .flat();

    let error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
