import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private service: WatchlistService) {}

  @Post()
  add(@AuthUser() user: any, @Body() body: { movieId: string }) {
    return this.service.add(user.id, body.movieId);
  }

  @Get()
  getAll(@AuthUser() user: any) {
    return this.service.getAll(user.id);
  }

  @Delete(':id')
  remove(@AuthUser() user: any, @Param('id') id: number) {
    return this.service.remove(user.id, id);
  }
}
