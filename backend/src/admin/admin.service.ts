import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Review } from '../entities/review.entity';
import { Watchlist } from '../entities/watchlist.entity';
import { ApiLog } from '../entities/api-log.entity';
import { LoginLog } from '../entities/login-log.entity';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Review) private reviews: Repository<Review>,
    @InjectRepository(Watchlist) private watchlists: Repository<Watchlist>,
    @InjectRepository(ApiLog) private apiLogs: Repository<ApiLog>,
    @InjectRepository(LoginLog) private loginLogs: Repository<LoginLog>,
    @InjectRepository(Subscription) private subscriptions: Repository<Subscription>,
  ) { }

  getUsers() {
    return this.users.find({
      relations: ['subscriptions', 'subscriptions.plan', 'childProfiles'],
      order: { id: 'DESC' },
      take: 100 // Optimization: don't load thousands of users at once
    });
  }

  deleteUser(id: number) {
    return this.users.delete(id);
  }

  async updateUserRole(userId: number, role: string) {
    if (!['user', 'parent', 'admin'].includes(role)) {
      throw new Error('Invalid role. Must be user, parent, or admin');
    }
    await this.users.update(userId, { role });
    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    const { password: _password, ...result } = user;
    return result;
  }

  getReviews() {
    return this.reviews.find({
      relations: ['user'],
      order: { id: 'DESC' },
      take: 100
    });
  }

  deleteReview(id: number) {
    return this.reviews.delete(id);
  }

  getLogs() {
    return this.loginLogs.find({
      order: { timestamp: 'DESC' },
      take: 50
    });
  }

  getWatchlists() {
    return this.watchlists.find({
      relations: ['user'],
      order: { id: 'DESC' },
      take: 100
    });
  }

  async getStats() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalReviews,
      totalWatchlist,
      apiCallsToday,
      activeSubscriptions,
    ] = await Promise.all([
      this.users.count(),
      this.reviews.count(),
      this.watchlists.count(),
      this.apiLogs.count(),
      this.subscriptions.count({ where: { status: 'active' } }),
    ]);

    // For real app use QueryBuilder count
    const [realRecentUsers, realRecentReviews, realRecentWatchlist] = await Promise.all([
      this.users.createQueryBuilder('u').where('u.createdAt > :date', { date: sevenDaysAgo }).getCount(),
      this.reviews.createQueryBuilder('r').where('r.createdAt > :date', { date: sevenDaysAgo }).getCount(),
      this.watchlists.createQueryBuilder('w').where('w.createdAt > :date', { date: sevenDaysAgo }).getCount(),
    ]);

    const calcChange = (total: number, recent: number) => {
      if (total === 0 || total === recent) return '+0%';
      const old = total - recent;
      if (old <= 0) return '+100%';
      const pct = (recent / old) * 100;
      return `+${pct.toFixed(1)}%`;
    };

    return {
      totalUsers,
      totalReviews,
      totalWatchlist,
      apiCallsToday,
      activeSubscriptions,
      changes: {
        users: calcChange(totalUsers, realRecentUsers),
        reviews: calcChange(totalReviews, realRecentReviews),
        watchlist: calcChange(totalWatchlist, realRecentWatchlist),
        api: `${apiCallsToday}`,
        subs: `${activeSubscriptions}`
      }
    };
  }
}
