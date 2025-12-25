import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from '../entities/plan.entity';
import { Subscription } from '../entities/subscription.entity';
import { Payment } from '../entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Subscription, Payment])],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
