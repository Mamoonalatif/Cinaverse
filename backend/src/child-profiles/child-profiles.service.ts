import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildProfile } from '../entities/child-profile.entity';

@Injectable()
export class ChildProfilesService {
  constructor(@InjectRepository(ChildProfile) private repo: Repository<ChildProfile>) {}

  list(parentId: number) {
    return this.repo.find({ where: { parent: { id: parentId } } });
  }

  async create(parentId: number, data: { name: string; age: number; maxAgeRating?: string | null; allowedGenres?: string | null }) {
    const profile = this.repo.create({ ...data, parent: { id: parentId } });
    return this.repo.save(profile);
  }

  async update(parentId: number, id: number, data: Partial<ChildProfile>) {
    const existing = await this.repo.findOne({ where: { id, parent: { id: parentId } } });
    if (!existing) throw new NotFoundException('Child profile not found');
    await this.repo.update(id, { ...data, parent: { id: parentId } });
    return this.repo.findOne({ where: { id, parent: { id: parentId } } });
  }

  async remove(parentId: number, id: number) {
    const existing = await this.repo.findOne({ where: { id, parent: { id: parentId } } });
    if (!existing) throw new NotFoundException('Child profile not found');
    await this.repo.delete(id);
    return { success: true };
  }

  async getOwned(parentId: number, id: number) {
    const profile = await this.repo.findOne({ where: { id, parent: { id: parentId } } });
    if (!profile) throw new ForbiddenException('Child profile not found or not yours');
    return profile;
  }
}
