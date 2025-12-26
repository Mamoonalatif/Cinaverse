import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
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
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY') || 'sk_test_dummy', { apiVersion: '2025-02-24.acacia' });
  }

  // ... (getAll and purchase methods remain same)
  getAll() {
    return this.plans.find();
  }

  async purchase(userId: number, planId: number, paymentMethodId: string) {
    // Legacy single-step
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
      // Deactivate existing active subscriptions
      await this.subs.update(
        { user: { id: userId }, status: 'active' },
        { status: 'inactive', endDate: new Date() }
      );

      const end = new Date();
      end.setMonth(end.getMonth() + 1);
      await this.subs.save({ user: { id: userId }, plan, startDate: new Date(), endDate: end, status: 'active' });
    }

    return payment;
  }

  async createPaymentIntent(userId: number, planId: number) {
    const plan = await this.plans.findOne({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');
    const intent = await this.stripe.paymentIntents.create({
      amount: plan.price,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { userId: userId.toString(), planId: planId.toString() },
    });

    const publicKey = this.config.get('STRIPE_PUBLIC_KEY') ||
      this.config.get('STRIPE_PUBLISHABLE_KEY') ||
      this.config.get('VITE_STRIPE_PUBLIC_KEY');

    return {
      clientSecret: intent.client_secret,
      publicKey
    };
  }

  async verifyPayment(userId: number, paymentIntentId: string, planId: number) {
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded') throw new Error('Payment not succeeded');

    const existing = await this.payments.findOne({ where: { stripePaymentId: paymentIntentId } });
    if (existing) return { success: true, message: 'Already processed' };

    const plan = await this.plans.findOne({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');

    await this.payments.save({
      user: { id: userId },
      stripePaymentId: intent.id,
      amount: intent.amount,
      status: intent.status,
    });

    // Deactivate existing active subscriptions
    await this.subs.update(
      { user: { id: userId }, status: 'active' },
      { status: 'inactive', endDate: new Date() }
    );

    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    await this.subs.save({
      user: { id: userId },
      plan,
      startDate: new Date(),
      endDate: end,
      status: 'active'
    });

    return { success: true };
  }
  async getUserSubscription(userId: any) {
    console.log(`[PlansService] Fetching subscription for user ID: ${userId} (${typeof userId})`);

    // Get the latest active subscription for the user
    // We look for 'active' status OR null (for legacy records)
    const sub = await this.subs.findOne({
      where: [
        { user: { id: userId }, status: 'active' },
        { user: { id: userId }, status: IsNull() as any }
      ],
      relations: ['plan', 'user'],
      order: { startDate: 'DESC' },
    });

    console.log(`[PlansService] Query result for user ${userId}:`, sub ? `Found ${sub.plan?.name}` : 'Not Found');



    if (!sub || !sub.plan) {
      return { plan: 'None', nextBilling: null, price: 0, features: [] };
    }
    // Example features, adjust as needed
    const features: string[] = [];
    if (sub.plan.name === 'Basic') features.push('Mobile Only', 'SD Streaming', '1 Device');
    if (sub.plan.name === 'Standard') features.push('HD Streaming', '2 Devices');
    if (sub.plan.name === 'Premium') features.push('4K + HDR', '4 Devices', 'Downloads');
    return {
      plan: sub.plan.name,
      nextBilling: sub.endDate,
      price: sub.plan.price,
      features,
    };
  }

  async updateUserSubscription(userId: number, planName: string) {
    // Find the plan by name
    const plan = await this.plans.findOne({ where: { name: planName } });
    if (!plan) throw new Error('Plan not found');
    // Deactivate existing active subscriptions
    await this.subs.update(
      { user: { id: userId }, status: 'active' },
      { status: 'inactive', endDate: new Date() }
    );
    // Start new subscription
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    const newSub = await this.subs.save({ user: { id: userId }, plan, startDate: new Date(), endDate: end });
    return {
      plan: newSub.plan.name,
      nextBilling: newSub.endDate,
      price: newSub.plan.price,
      features: plan.name === 'Basic' ? ['Mobile Only', 'SD Streaming', '1 Device'] : plan.name === 'Standard' ? ['HD Streaming', '2 Devices'] : ['4K + HDR', '4 Devices', 'Downloads'],
    };
  }

  async unsubscribe(userId: number) {
    await this.subs.update(
      { user: { id: userId }, status: 'active' },
      { status: 'inactive', endDate: new Date() }
    );
    return { success: true };
  }
}
