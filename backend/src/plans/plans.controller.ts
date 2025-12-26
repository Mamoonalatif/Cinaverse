import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';

@Controller()
export class PlansController {
  constructor(private service: PlansService) { }

  @Get('plans')
  getAll() {
    return this.service.getAll();
  }

  @Post('plans/purchase')
  @UseGuards(JwtAuthGuard)
  purchase(@AuthUser() user: any, @Body() body: { planId: number; paymentMethodId: string }) {
    return this.service.purchase(user.id, body.planId, body.paymentMethodId);
  }

  @Post('payments/create-intent')
  @UseGuards(JwtAuthGuard)
  createIntent(@AuthUser() user: any, @Body() body: { planId: number }) {
    return this.service.createPaymentIntent(user.id, body.planId);
  }

  @Post('payments/verify')
  @UseGuards(JwtAuthGuard)
  verifyPayment(@AuthUser() user: any, @Body() body: { paymentIntentId: string; planId: number }) {
    return this.service.verifyPayment(user.id, body.paymentIntentId, body.planId);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  async getSubscription(@AuthUser() user: any) {
    return this.service.getUserSubscription(user.id);
  }

  @Post('subscription/update')
  @UseGuards(JwtAuthGuard)
  async updateSubscription(@AuthUser() user: any, @Body() body: { planName: string }) {
    return this.service.updateUserSubscription(user.id, body.planName);
  }
  @Post('subscription/cancel')
  @UseGuards(JwtAuthGuard)
  async unsubscribe(@AuthUser() user: any) {
    return this.service.unsubscribe(user.id);
  }
}
