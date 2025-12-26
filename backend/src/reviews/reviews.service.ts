import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { ApiLogService } from '../logs/api-log.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private repo: Repository<Review>,
    @Inject(forwardRef(() => ApiLogService)) private apiLogService: ApiLogService,
  ) { }

  async create(userId: number, movieId: string, rating: number, comment: string) {
    const result = await this.repo.save({ movieId, rating, comment, user: { id: userId } });
    this.apiLogService.createApiLog({ id: userId } as any, '/review', 201).catch(() => { });
    return result;
  }

  getByMovie(movieId: string) {
    return this.repo.find({ where: { movieId }, relations: ['user'] });
  }

  async update(userId: number, id: number, data: any) {
    await this.repo.update({ id, user: { id: userId } }, data);
    this.apiLogService.createApiLog({ id: userId } as any, '/review', 200).catch(() => { });
    return this.repo.findOne({ where: { id } });
  }

  async delete(userId: number, id: number) {
    const result = await this.repo.delete({ id, user: { id: userId } });
    this.apiLogService.createApiLog({ id: userId } as any, '/review', 204).catch(() => { });
    return result;
  }
}
