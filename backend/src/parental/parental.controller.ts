import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ParentalService } from './parental.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('parental')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('parent')
export class ParentalController {
  constructor(private service: ParentalService) {}

  @Post('settings')
  update(@AuthUser() user: any, @Body() body: { minAge: number; bannedGenres?: string }) {
    return this.service.update(user.id, body);
  }

  @Get('settings')
  get(@AuthUser() user: any) {
    return this.service.get(user.id);
  }
}
