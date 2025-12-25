import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParentalSettings } from '../entities/parental-settings.entity';

@Injectable()
export class ParentalService {
  constructor(@InjectRepository(ParentalSettings) private repo: Repository<ParentalSettings>) {}

  async update(userId: number, data: any) {
    const existing = await this.repo.findOne({ where: { user: { id: userId } } });
    if (existing) {
      return this.repo.save({ ...existing, ...data });
    }
    return this.repo.save({ ...data, user: { id: userId } });
  }

  get(userId: number) {
    return this.repo.findOne({ where: { user: { id: userId } } });
  }
}
