import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeApiKey: process.env.STRIPE_API_KEY,
  basicPlan: process.env.BASIC_PLAN,
  premiumPlan: process.env.PREMIUM_PLAN,
  stripeWebHookSecret: process.env.STRIPE_WEBHOOK_SECRET,
}));
