import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsController } from './logs.controller';
import { LoginLogService } from './login-log.service';
import { ApiLogService } from './api-log.service';
import { LoginLog } from '../entities/login-log.entity';
import { ApiLog } from '../entities/api-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoginLog, ApiLog])],
  controllers: [LogsController],
  providers: [LoginLogService, ApiLogService],
  exports: [LoginLogService, ApiLogService],
})
export class LogsModule {}
