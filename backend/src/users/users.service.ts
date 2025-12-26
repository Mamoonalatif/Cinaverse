import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async getProfile(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) return null;
    const { password, ...profile } = user as any;
    return profile;
  }

  async updateProfile(id: number, data: any) {
    await this.repo.update(id, data);
    return this.getProfile(id);
  }

  async updateUserRole(userId: number, role: string) {
    if (!['user', 'parent', 'admin'].includes(role)) {
      throw new Error('Invalid role');
    }
    await this.repo.update(userId, { role });
    return this.getProfile(userId);
  }
}
