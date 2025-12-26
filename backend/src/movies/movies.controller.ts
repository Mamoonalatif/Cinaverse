import { Controller, Get, Query, Param, UseGuards, Headers } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt.guard';
import { AuthUser } from '../common/decorators/user.decorator';

@Controller('movies')
@UseGuards(OptionalJwtAuthGuard)
export class MoviesController {
  constructor(private service: MoviesService) { }

  @Get('search')
  search(@AuthUser() user: any, @Headers('x-child-id') childId?: string, @Query('q') q?: string, @Query('query') query?: string) {
    const term = q ?? query ?? '';
    return this.service.search(term, user?.id, childId ? parseInt(childId, 10) : undefined);
  }

  @Get('trending')
  getTrending(@AuthUser() user: any, @Headers('x-child-id') childId?: string, @Query('timeWindow') timeWindow?: 'day' | 'week') {
    return this.service.getTrending(timeWindow || 'week', user?.id, childId ? parseInt(childId, 10) : undefined);
  }

  @Get('popular')
  getPopular(@AuthUser() user: any, @Headers('x-child-id') childId?: string, @Query('page') page?: string) {
    return this.service.getPopular(page ? parseInt(page) : 1, user?.id, childId ? parseInt(childId, 10) : undefined);
  }

  @Get('latest')
  getLatest(@AuthUser() user: any, @Headers('x-child-id') childId?: string) {
    return this.service.getLatestReleases(user?.id, childId ? parseInt(childId, 10) : undefined);
  }

  @Get('genres')
  getGenres() {
    return this.service.getGenres();
  }

  @Get(':id')
  getDetails(@AuthUser() user: any, @Headers('x-child-id') childId: string, @Param('id') id: string) {
    return this.service.getDetails(id, user?.id, childId ? parseInt(childId, 10) : undefined);
  }

  @Get(':id/trailer')
  getTrailer(@Param('id') id: string) {
    return this.service.getTrailer(id);
  }

  @Get(':id/similar')
  getSimilar(@AuthUser() user: any, @Headers('x-child-id') childId: string, @Param('id') id: string) {
    return this.service.getSimilarMovies(id, user?.id, childId ? parseInt(childId, 10) : undefined);
  }

  @Get(':id/streaming')
  getStreaming(@Param('id') id: string) {
    return { providers: [] };
  }
}
