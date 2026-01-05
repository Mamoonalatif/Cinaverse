import { Test, TestingModule } from '@nestjs/testing';
import { ChildProfilesService } from './child-profiles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChildProfile } from '../entities/child-profile.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ChildProfilesService', () => {
    let service: ChildProfilesService;
    let mockRepo;

    beforeEach(async () => {
        mockRepo = {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChildProfilesService,
                { provide: getRepositoryToken(ChildProfile), useValue: mockRepo },
            ],
        }).compile();

        service = module.get<ChildProfilesService>(ChildProfilesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a child profile', async () => {
            const parentId = 1;
            const data = { name: 'Kiddo', age: 10 };
            const savedProfile = { id: 1, ...data, parent: { id: parentId } };

            mockRepo.create.mockReturnValue(savedProfile);
            mockRepo.save.mockResolvedValue(savedProfile);

            const result = await service.create(parentId, data);
            expect(result).toEqual(savedProfile);
            expect(mockRepo.create).toHaveBeenCalledWith({ ...data, parent: { id: parentId } });
        });
    });

    describe('list', () => {
        it('should return list of profiles for parent', async () => {
            const output = [{ id: 1, name: 'Kiddo' }];
            mockRepo.find.mockResolvedValue(output);

            const result = await service.list(1);
            expect(result).toEqual(output);
            expect(mockRepo.find).toHaveBeenCalledWith({ where: { parent: { id: 1 } } });
        });
    });

    describe('remove', () => {
        it('should delete a profile', async () => {
            mockRepo.delete.mockResolvedValue({ affected: 1 });
            const result = await service.remove(1, 10);
            expect(result).toEqual({ success: true });
        });

        it('should throw NotFoundException if not found', async () => {
            mockRepo.delete.mockResolvedValue({ affected: 0 });
            await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
        });
    });
});
