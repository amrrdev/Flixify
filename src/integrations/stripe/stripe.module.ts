import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import stripeConfig from './config/stripe.config';
import { StripeController } from './stripe.controller';
import { UsersModule } from '../../users/users.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [ConfigModule.forFeature(stripeConfig), UsersModule, DatabaseModule],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
