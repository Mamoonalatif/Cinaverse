import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiLog } from '../entities/api-log.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ApiLogService {
  constructor(@InjectRepository(ApiLog) private readonly repo: Repository<ApiLog>) {}

  getUserApiLogs(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { timestamp: 'DESC' },
      take: 50,
    });
  }

  async createApiLog(user: User | null, endpoint: string, statusCode: number, timestamp?: Date) {
    const log = this.repo.create({
      user,
      endpoint,
      statusCode,
      timestamp: timestamp || new Date(),
    });
    return this.repo.save(log);
  }
}
