import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';
import { LoginLogService } from './login-log.service';
import { ApiLogService } from './api-log.service';

@Controller('logs')
@UseGuards(JwtAuthGuard)
export class LogsController {
  constructor(
    private readonly loginLogService: LoginLogService,
    private readonly apiLogService: ApiLogService,
  ) {}

  @Get('login')
  getUserLoginLogs(@AuthUser() user: any) {
    return this.loginLogService.getUserLoginLogs(user.id);
  }

  @Get('api')
  getUserApiLogs(@AuthUser() user: any) {
    return this.apiLogService.getUserApiLogs(user.id);
  }

  // Admin endpoints (could be expanded for all logs)
  @Get('login/admin')
  async getAllLoginLogs(@AuthUser() user: any) {
    if (user.role !== 'admin') throw new Error('Forbidden');
    // For demo, just return all logs (limit 200)
    return this.loginLogService['repo'].find({ order: { timestamp: 'DESC' }, take: 200 });
  }

  @Get('api/admin')
  async getAllApiLogs(@AuthUser() user: any) {
    if (user.role !== 'admin') throw new Error('Forbidden');
    return this.apiLogService['repo'].find({ order: { timestamp: 'DESC' }, take: 200 });
  }
}
