import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildProfile } from '../entities/child-profile.entity';
import { ChildProfilesService } from './child-profiles.service';
import { ChildProfilesController } from './child-profiles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChildProfile])],
  controllers: [ChildProfilesController],
  providers: [ChildProfilesService],
  exports: [ChildProfilesService],
})
export class ChildProfilesModule {}
