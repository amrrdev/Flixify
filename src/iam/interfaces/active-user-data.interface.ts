import { Role } from '../../users/enums/roles.enum';

export interface ActiveUserDate {
  sub: number;
  email: string;
  role: 'Admin' | 'User';
  stripeCustomerId: string;
}
