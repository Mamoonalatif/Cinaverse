import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ChildProfilesService } from './child-profiles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/decorators/user.decorator';

@Controller('child-profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('parent')
export class ChildProfilesController {
  constructor(private service: ChildProfilesService) {}

  @Get()
  list(@AuthUser() user: any) {
    return this.service.list(user.id);
  }

  @Post()
  create(
    @AuthUser() user: any,
    @Body() body: { name: string; age: number; maxAgeRating?: string | null; allowedGenres?: string | null },
  ) {
    return this.service.create(user.id, body);
  }

  @Put(':id')
  update(
    @AuthUser() user: any,
    @Param('id') id: string,
    @Body() body: { name?: string; age?: number; maxAgeRating?: string | null; allowedGenres?: string | null },
  ) {
    return this.service.update(user.id, parseInt(id, 10), body);
  }

  @Delete(':id')
  remove(@AuthUser() user: any, @Param('id') id: string) {
    return this.service.remove(user.id, parseInt(id, 10));
  }
}
