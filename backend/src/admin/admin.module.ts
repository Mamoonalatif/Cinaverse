import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Review } from '../entities/review.entity';
import { Log } from '../entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Review, Log])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
