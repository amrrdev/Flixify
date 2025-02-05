import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY, ROLES_KEY as ROLES_KEY } from '../../iam.constants';
import { ActiveUserDate } from '../../interfaces/active-user-data.interface';
import { Request } from 'express';
import { Role } from '../../../users/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!contextRoles) {
      return true;
    }

    const user: ActiveUserDate = context.switchToHttp().getRequest<Request>()[
      REQUEST_USER_KEY
    ];
    console.log(user);
    return contextRoles.some((role) => user?.role === role);
  }
}
