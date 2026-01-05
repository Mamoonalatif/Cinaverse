import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;
    let mockService;

    beforeEach(async () => {
        mockService = {
            getProfile: jest.fn(),
            updateProfile: jest.fn(),
            updateUserRole: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: UsersService, useValue: mockService },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const user = { id: 1, email: 'test@test.com' };
            mockService.getProfile.mockResolvedValue(user);
            expect(await controller.getProfile({ id: 1 } as any)).toBe(user);
        });
    });

    describe('updateProfile', () => {
        it('should update profile', async () => {
            const updates = { firstName: 'Test' };
            const user = { id: 1, ...updates };
            mockService.updateProfile.mockResolvedValue(user);
            expect(await controller.updateProfile({ id: 1 } as any, updates)).toBe(user);
        });
    });
});
