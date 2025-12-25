import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Watchlist } from '../entities/watchlist.entity';
import { Review } from '../entities/review.entity';
import { MovieCache } from '../entities/movie-cache.entity';
import { ParentalSettings } from '../entities/parental-settings.entity';
import { Plan } from '../entities/plan.entity';
import { Subscription } from '../entities/subscription.entity';
import { Payment } from '../entities/payment.entity';
import { Log } from '../entities/log.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<DataSourceOptions> => ({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST', 'localhost'),
    port: configService.get<number>('DATABASE_PORT', 5432),
    username: configService.get<string>('DATABASE_USER', 'postgres'),
    password: configService.get<string>('DATABASE_PASSWORD', ''),
    database: configService.get<string>('DATABASE_NAME', 'cinaverse'),
    entities: [
      User,
      Role,
      Watchlist,
      Review,
      MovieCache,
      ParentalSettings,
      Plan,
      Subscription,
      Payment,
      Log,
    ],
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
    logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
  }),
};
