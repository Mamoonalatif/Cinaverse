import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private service: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@AuthUser() user: any, @Body() body: { movieId: string; rating: number; comment: string }) {
    return this.service.create(user.id, body.movieId, body.rating, body.comment);
  }

  @Get(':movieId')
  getByMovie(@Param('movieId') movieId: string) {
    return this.service.getByMovie(movieId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@AuthUser() user: any, @Param('id') id: number, @Body() body: { rating?: number; comment?: string }) {
    return this.service.update(user.id, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@AuthUser() user: any, @Param('id') id: number) {
    return this.service.delete(user.id, id);
  }
}
