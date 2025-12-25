import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../entities/plan.entity';
import { Subscription } from '../entities/subscription.entity';
import { Payment } from '../entities/payment.entity';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlansService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Plan) private plans: Repository<Plan>,
    @InjectRepository(Subscription) private subs: Repository<Subscription>,
    @InjectRepository(Payment) private payments: Repository<Payment>,
    config: ConfigService,
  ) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY') || 'sk_test_dummy', { apiVersion: '2025-02-24.acacia' });
  }

  getAll() {
    return this.plans.find();
  }

  async purchase(userId: number, planId: number, paymentMethodId: string) {
    const plan = await this.plans.findOne({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');

    const intent = await this.stripe.paymentIntents.create({
      amount: plan.price,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    const payment = await this.payments.save({
      user: { id: userId },
      stripePaymentId: intent.id,
      amount: plan.price,
      status: intent.status,
    });

    if (intent.status === 'succeeded') {
      const end = new Date();
      end.setMonth(end.getMonth() + 1);
      await this.subs.save({ user: { id: userId }, plan, startDate: new Date(), endDate: end });
    }

    return payment;
  }
}
