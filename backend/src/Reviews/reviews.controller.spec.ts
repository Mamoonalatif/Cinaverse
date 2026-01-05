import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

describe('ReviewsController', () => {
    let controller: ReviewsController;
    let mockService;

    beforeEach(async () => {
        mockService = {
            create: jest.fn(),
            getByMovie: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReviewsController],
            providers: [
                { provide: ReviewsService, useValue: mockService },
            ],
        }).compile();

        controller = module.get<ReviewsController>(ReviewsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create review', async () => {
            const dto = { movieId: '100', rating: 5, comment: 'Nice' };
            const result = { id: 1, ...dto };
            mockService.create.mockResolvedValue(result);
            expect(await controller.create({ id: 1 } as any, dto)).toBe(result);
        });
    });

    describe('getByMovie', () => {
        it('should get reviews by movie', async () => {
            const result = [{ id: 1, comment: 'Nice' }];
            mockService.getByMovie.mockResolvedValue(result);
            expect(await controller.getByMovie('100')).toBe(result);
        });
    });
});
