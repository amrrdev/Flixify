import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import stripeConfig from './config/stripe.config';
import { ConfigType } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UsersService } from '../../users/users.service';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  constructor(
    @Inject(stripeConfig.KEY)
    private readonly stripeConfigrations: ConfigType<typeof stripeConfig>,
    private readonly usersService: UsersService,
    private readonly databaseService: DatabaseService,
  ) {
    this.stripe = new Stripe(this.stripeConfigrations.stripeSecretKey!, {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email: createCustomerDto.email,
      payment_method: 'pm_card_visa',
      invoice_settings: { default_payment_method: 'pm_card_visa' },
    });
  }

  async createSubscription(
    plan: 'Basic' | 'Premium',
    stripeCustomerId: string,
  ) {
    const existingSubscriptions = await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
    });
    console.log(existingSubscriptions);
    if (existingSubscriptions.data.length > 0) {
      throw new BadRequestException('User already has an active subscription');
    }

    const subscription = await this.stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [
        {
          plan:
            plan === 'Premium'
              ? this.stripeConfigrations.premiumPlan
              : this.stripeConfigrations.basicPlan,
        },
      ],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null;

    const paymentIntent =
      latestInvoice?.payment_intent as Stripe.PaymentIntent | null;

    return {
      subscriptionId: subscription.id,
      status: subscription.status,
      paymentIntentId: paymentIntent?.id || null,
      clientSecret: paymentIntent?.client_secret || null,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.confirm(paymentIntentId);
      return { status: paymentIntent.status };
    } catch (error) {
      return error.message;
    }
  }

  async retrieveSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async getAllPrices() {
    return await this.stripe.prices.list();
  }

  async handleWebhook(reqBody: Buffer<ArrayBufferLike>, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        reqBody,
        signature,
        this.stripeConfigrations.stripeWebHookSecret!,
      );
    } catch (err) {
      console.log('error in the fucking thinkg');
      return;
    }

    const customerId = this.getCustomerIdFromEvent(event);

    if (!customerId) {
      console.error('No customer ID found in the event');
      return;
    }

    const user = await this.databaseService.users.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error('User not found for customer ID:', customerId);
      return;
    }

    switch (event.type) {
      case 'invoice.payment_succeeded':
        await this.handlePaymentSuccessed(event, user.id, 'Active');
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event, user.id, 'NotSubscribed');
        break;
    }
    return;
  }
  async handlePaymentSuccessed(
    event: Stripe.Event,
    sub: number,
    state: 'Active',
  ) {
    const priceId = await this.getPriceId(event);
    const planName = this.getPlanName(priceId);
    await this.usersService.newSubscription(sub, planName, state);
  }

  getCustomerIdFromEvent(event: Stripe.Event): string | undefined {
    switch (event.type) {
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
        return (event.data.object as Stripe.Invoice).customer as string;
    }
  }

  async handlePaymentFailed(
    event: Stripe.Event,
    sub: number,
    state: 'NotSubscribed',
  ) {
    const priceId = await this.getPriceId(event);
    const planName = this.getPlanName(priceId);
    await this.usersService.newSubscription(sub, planName, state);
  }

  private async getPriceId(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.subscription as string;
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;
    return priceId;
  }

  getPlanName(priceId: string): 'Basic' | 'Premium' {
    const planMapping: Record<string, 'Basic' | 'Premium'> = {
      [this.stripeConfigrations.basicPlan!]: 'Basic',
      [this.stripeConfigrations.premiumPlan!]: 'Premium',
    };
    return planMapping[priceId] || 'Basic';
  }
}
