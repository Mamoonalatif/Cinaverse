import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Review } from '../entities/review.entity';
import { Watchlist } from '../entities/watchlist.entity';
import { ApiLog } from '../entities/api-log.entity';
import { LoginLog } from '../entities/login-log.entity';
import { Subscription } from '../entities/subscription.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Review, Watchlist, ApiLog, LoginLog, Subscription])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
