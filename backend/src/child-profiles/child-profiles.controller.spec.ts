import { Test, TestingModule } from '@nestjs/testing';
import { ChildProfilesController } from './child-profiles.controller';
import { ChildProfilesService } from './child-profiles.service';

describe('ChildProfilesController', () => {
    let controller: ChildProfilesController;
    let mockService;

    beforeEach(async () => {
        mockService = {
            list: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getOwned: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ChildProfilesController],
            providers: [
                { provide: ChildProfilesService, useValue: mockService },
            ],
        }).compile();

        controller = module.get<ChildProfilesController>(ChildProfilesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('list', () => {
        it('should list profiles', async () => {
            const list = [{ id: 1, name: 'Kid' }];
            mockService.list.mockResolvedValue(list);
            expect(await controller.list({ id: 1 } as any)).toBe(list);
        });
    });

    describe('create', () => {
        it('should create profile', async () => {
            const dto = { name: 'Kid', age: 8 };
            const result = { id: 1, ...dto };
            mockService.create.mockResolvedValue(result);
            expect(await controller.create({ id: 1 } as any, dto)).toBe(result);
        });
    });
});
