import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

describe('UsersService', () => {
    let service: UsersService;
    let mockRepo;

    beforeEach(async () => {
        mockRepo = {
            findOne: jest.fn(),
            update: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(User), useValue: mockRepo },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProfile', () => {
        it('should return user profile without password', async () => {
            const user = { id: 1, email: 'test@test.com', password: 'hash', role: 'user' };
            mockRepo.findOne.mockResolvedValue(user);

            const result = await service.getProfile(1);
            expect(result).not.toHaveProperty('password');
            expect(result.email).toBe('test@test.com');
        });

        it('should return null if user not found', async () => {
            mockRepo.findOne.mockResolvedValue(null);
            const result = await service.getProfile(999);
            expect(result).toBeNull();
        });
    });

    describe('updateUserRole', () => {
        it('should update user role', async () => {
            const user = { id: 1, email: 'test@test.com', role: 'parent' }; // Updated state
            mockRepo.update.mockResolvedValue({ affected: 1 });
            mockRepo.findOne.mockResolvedValue(user); // Return updated user

            const result = await service.updateUserRole(1, 'parent');
            expect(mockRepo.update).toHaveBeenCalledWith(1, { role: 'parent' });
            expect(result.role).toBe('parent');
        });

        it('should throw error for invalid role', async () => {
            await expect(service.updateUserRole(1, 'god-mode'))
                .rejects
                .toThrow('Invalid role');
        });
    });
});
