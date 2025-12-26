import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieCache } from '../entities/movie-cache.entity';
import { ParentalSettings } from '../entities/parental-settings.entity';
import { ChildProfile } from '../entities/child-profile.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([MovieCache, ParentalSettings, ChildProfile])],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
