import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';

@Controller('plans')
export class PlansController {
  constructor(private service: PlansService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post('purchase')
  @UseGuards(JwtAuthGuard)
  purchase(@AuthUser() user: any, @Body() body: { planId: number; paymentMethodId: string }) {
    return this.service.purchase(user.id, body.planId, body.paymentMethodId);
  }
}
