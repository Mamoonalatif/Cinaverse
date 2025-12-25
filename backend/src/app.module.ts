import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ParentalModule } from './parental/parental.module';
import { PlansModule } from './plans/plans.module';
import { AdminModule } from './admin/admin.module';
import { LogsModule } from './logs/logs.module';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Watchlist } from './entities/watchlist.entity';
import { Review } from './entities/review.entity';
import { MovieCache } from './entities/movie-cache.entity';
import { ParentalSettings } from './entities/parental-settings.entity';
import { Plan } from './entities/plan.entity';
import { Subscription } from './entities/subscription.entity';
import { Payment } from './entities/payment.entity';
import { Log } from './entities/log.entity';
import { ChildProfile } from './entities/child-profile.entity';
import { ChildProfilesModule } from './child-profiles/child-profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const common = {
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
            ChildProfile,
          ],
          synchronize: config.get<string>('NODE_ENV') !== 'production',
          logging: config.get<string>('DB_LOGGING', 'false') === 'true',
        };

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: true,
            ...common,
          };
        }

        return {
          type: 'postgres',
          host: config.get<string>('DATABASE_HOST', 'localhost'),
          port: config.get<number>('DATABASE_PORT', 5432),
          username: config.get<string>('DATABASE_USER', 'postgres'),
          password: config.get<string>('DATABASE_PASSWORD', ''),
          database: config.get<string>('DATABASE_NAME', 'cinaverse'),
          ...common,
        };
      },
    }),
    AuthModule,
    UsersModule,
    MoviesModule,
    WatchlistModule,
    ReviewsModule,
    ParentalModule,
    ChildProfilesModule,
    PlansModule,
    AdminModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
