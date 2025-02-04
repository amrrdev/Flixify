import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  Headers,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';
import { Request, Response } from 'express';
import { Auth } from '../../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../../iam/authentication/enum/auth-type.enum';

@Controller('subscriptions')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-subscription/:plan')
  createSubscription(
    @ActiveUser('stripeCustomerId') stripeCustomerId: string,
    @Param('plan') plan: 'Basic' | 'Premium',
  ) {
    return this.stripeService.createSubscription(plan, stripeCustomerId);
  }

  @Get(':subscriptionId')
  retrieveSubscription(@Param('subscriptionId') subscriptionId: string) {
    return this.stripeService.retrieveSubscription(subscriptionId);
  }

  @Post('confirm-payment')
  confirmPayment(@Body('paymentIntentId') paymentIntentId: string) {
    return this.stripeService.confirmPayment(paymentIntentId);
  }

  @Post('webhook')
  @Auth(AuthType.NONE)
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    console.log('i am in web hook');
    const rawBody = req.body;

    await this.stripeService.handleWebhook(rawBody, signature);
    res.send('fuck');
  }
}
