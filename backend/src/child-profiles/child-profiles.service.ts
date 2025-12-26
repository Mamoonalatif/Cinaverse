import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildProfile } from '../entities/child-profile.entity';

@Injectable()
export class ChildProfilesService {
  constructor(@InjectRepository(ChildProfile) private repo: Repository<ChildProfile>) { }

  list(parentId: number) {
    return this.repo.find({ where: { parent: { id: parentId } } });
  }

  async create(parentId: number, data: { name: string; age: number; maxAgeRating?: string | null; allowedGenres?: string | null }) {
    const profile = this.repo.create({ ...data, parent: { id: parentId } });
    return this.repo.save(profile);
  }

  async update(parentId: number, id: number, data: Partial<ChildProfile>) {
    // Combine existence check and update
    const result = await this.repo.update({ id, parent: { id: parentId } }, data);
    if (result.affected === 0) throw new NotFoundException('Profile not found');
    return this.repo.findOne({ where: { id } });
  }

  async remove(parentId: number, id: number) {
    const result = await this.repo.delete({ id, parent: { id: parentId } });
    if (result.affected === 0) throw new NotFoundException('Profile not found');
    return { success: true };
  }

  async getOwned(parentId: number, id: number) {
    const profile = await this.repo.findOne({ where: { id, parent: { id: parentId } } });
    if (!profile) throw new ForbiddenException('Child profile not found or not yours');
    return profile;
  }
}
