import { UserRole } from '@prisma/client';

export interface ActiveUserDate {
  sub: number;
  email: string;
  role: UserRole;
  stripeCustomerId: string;
}
