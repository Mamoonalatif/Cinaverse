import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('profile')
  getProfile(@AuthUser() user: any) {
    return this.service.getProfile(user.id);
  }

  @Put('profile')
  updateProfile(@AuthUser() user: any, @Body() data: any) {
    return this.service.updateProfile(user.id, data);
  }
}
