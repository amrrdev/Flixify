import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { ActiveUserDate } from '../../interfaces/active-user-data.interface';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { sub, email } = context.switchToHttp().getRequest<Request>()[
      REQUEST_USER_KEY
    ] satisfies ActiveUserDate;

    const foundUser = await this.databaseService.users.findFirst({
      where: {
        email: email,
        id: sub,
      },
      include: {
        subscription: {
          select: {
            status: true,
          },
        },
      },
    });
    if (!foundUser || foundUser.subscription.length === 0) {
      throw new ForbiddenException('No active subscription found.');
    }
    const activeSubscription = foundUser.subscription.find(
      (sub) => sub.status === 'Active',
    );

    if (!activeSubscription) {
      throw new ForbiddenException('Your subscription is not active.');
    }

    return true;
  }
}
