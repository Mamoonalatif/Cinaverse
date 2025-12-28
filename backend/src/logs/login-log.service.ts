import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginLog } from '../entities/login-log.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class LoginLogService {
  constructor(@InjectRepository(LoginLog) private readonly repo: Repository<LoginLog>) {}

  getUserLoginLogs(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { timestamp: 'DESC' },
      take: 50,
    });
  }

  async createLoginLog(user: User | null, activity: string, ipAddress?: string, timestamp?: Date) {
    const log = this.repo.create({
      user,
      activity,
      ipAddress,
      timestamp: timestamp || new Date(),
    });
    return this.repo.save(log);
  }
}
