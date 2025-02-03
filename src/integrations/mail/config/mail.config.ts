import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  user: process.env.GMAIL_USERNAME,
  password: process.env.GMAIL_PASSWORD,
}));
