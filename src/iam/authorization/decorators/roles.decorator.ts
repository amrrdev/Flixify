import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../../iam.constants';
import { Role } from '../../../users/enums/roles.enum';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
