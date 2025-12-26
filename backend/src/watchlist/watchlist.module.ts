import { Module, forwardRef } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from '../entities/watchlist.entity';
import { LoginLogService } from '../logs/login-log.service';
import { ApiLogService } from '../logs/api-log.service';
import { LoginLog } from '../entities/login-log.entity';
import { ApiLog } from '../entities/api-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Watchlist, LoginLog, ApiLog]),
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService, LoginLogService, ApiLogService],
})
export class WatchlistModule {}
