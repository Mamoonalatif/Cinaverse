import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from '../entities/watchlist.entity';
import { LoginLogService } from '../logs/login-log.service';
import { ApiLogService } from '../logs/api-log.service';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist) private repo: Repository<Watchlist>,
    @Inject(forwardRef(() => LoginLogService)) private loginLogService: LoginLogService,
    @Inject(forwardRef(() => ApiLogService)) private apiLogService: ApiLogService,
  ) { }

  async add(userId: number, movieId: string, category?: string, status?: string) {
    // Check if movie already exists in user's watchlist
    const existing = await this.repo.findOne({
      where: {
        user: { id: userId },
        movieId: movieId
      }
    });

    if (existing) {
      throw new Error('This movie is already in your watchlist');
    }

    const result = await this.repo.save({ movieId, user: { id: userId }, category, status });
    this.apiLogService.createApiLog({ id: userId } as any, '/watchlist', 201).catch(() => { });
    return result;
  }

  getAll(userId: number) {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  async remove(userId: number, id: number) {
    const result = await this.repo.delete({ id, user: { id: userId } });
    this.apiLogService.createApiLog({ id: userId } as any, '/watchlist/' + id, 204).catch(() => { });
    return result;
  }

  async update(userId: number, id: number, update: { category?: string; status?: string }) {
    await this.repo.update({ id, user: { id: userId } }, update);
    const item = await this.repo.findOne({ where: { id } });
    this.apiLogService.createApiLog({ id: userId } as any, '/watchlist/' + id, 200).catch(() => { });
    return item;
  }
}
