import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private repo: Repository<Review>) {}

  create(userId: number, movieId: string, rating: number, comment: string) {
    return this.repo.save({ movieId, rating, comment, user: { id: userId } });
  }

  getByMovie(movieId: string) {
    return this.repo.find({ where: { movieId }, relations: ['user'] });
  }

  async update(userId: number, id: number, data: any) {
    await this.repo.update({ id, user: { id: userId } }, data);
    return this.repo.findOne({ where: { id } });
  }

  delete(userId: number, id: number) {
    return this.repo.delete({ id, user: { id: userId } });
  }
}
