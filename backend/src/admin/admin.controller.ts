import { Controller, Get, Delete, Param, UseGuards, Patch, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private service: AdminService) {}

  @Get('users')
  getUsers() {
    return this.service.getUsers();
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: number) {
    return this.service.deleteUser(id);
  }

  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: number, @Body('role') role: string) {
    return this.service.updateUserRole(id, role);
  }

  @Delete('reviews/:id')
  deleteReview(@Param('id') id: number) {
    return this.service.deleteReview(id);
  }

  @Get('logs')
  getLogs() {
    return this.service.getLogs();
  }
}
