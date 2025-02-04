import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../../iam.constants';
import { UserRole } from '@prisma/client';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
