import { Module } from '@nestjs/common';
import { ParentalController } from './parental.controller';
import { ParentalService } from './parental.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentalSettings } from '../entities/parental-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParentalSettings])],
  controllers: [ParentalController],
  providers: [ParentalService],
})
export class ParentalModule {}
