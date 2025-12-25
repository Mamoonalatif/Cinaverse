import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Review } from '../entities/review.entity';
import { Log } from '../entities/log.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Review) private reviews: Repository<Review>,
    @InjectRepository(Log) private logs: Repository<Log>,
  ) {}

  getUsers() {
    return this.users.find();
  }

  deleteUser(id: number) {
    return this.users.delete(id);
  }

  async updateUserRole(userId: number, role: string) {
    if (!['user', 'parent', 'admin'].includes(role)) {
      throw new Error('Invalid role. Must be user, parent, or admin');
    }
    await this.users.update(userId, { role });
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _password, ...result } = user;
    return result;
  }

  deleteReview(id: number) {
    return this.reviews.delete(id);
  }

  getLogs() {
    return this.logs.find({ relations: ['user'], order: { createdAt: 'DESC' }, take: 100 });
  }
}
