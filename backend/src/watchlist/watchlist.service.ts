import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from '../entities/watchlist.entity';

@Injectable()
export class WatchlistService {
  constructor(@InjectRepository(Watchlist) private repo: Repository<Watchlist>) {}

  add(userId: number, movieId: string) {
    return this.repo.save({ movieId, user: { id: userId } });
  }

  getAll(userId: number) {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  remove(userId: number, id: number) {
    return this.repo.delete({ id, user: { id: userId } });
  }
}
