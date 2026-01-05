import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { ApiLogService } from '../logs/api-log.service';

describe('ReviewsService', () => {
    let service: ReviewsService;
    let mockRepo;
    let mockApiLogService;

    beforeEach(async () => {
        mockRepo = {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        mockApiLogService = {
            createApiLog: jest.fn().mockResolvedValue(true),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewsService,
                { provide: getRepositoryToken(Review), useValue: mockRepo },
                { provide: ApiLogService, useValue: mockApiLogService },
            ],
        }).compile();

        service = module.get<ReviewsService>(ReviewsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a review', async () => {
            const userId = 1;
            const reviewData = { movieId: '123', rating: 5, comment: 'Great!' };
            const savedReview = { id: 1, ...reviewData, user: { id: userId }, isVisible: true };

            mockRepo.save.mockResolvedValue(savedReview);
            mockRepo.findOne.mockResolvedValue(savedReview);

            const result = await service.create(userId, reviewData.movieId, reviewData.rating, reviewData.comment);
            expect(result).toEqual(savedReview);
            expect(mockRepo.save).toHaveBeenCalled();
        });
    });

    describe('getByMovie', () => {
        it('should return visible reviews for a movie', async () => {
            const reviews = [{ id: 1, comment: 'Good', isVisible: true }];
            mockRepo.find.mockResolvedValue(reviews);

            const result = await service.getByMovie('123');
            expect(result).toEqual(reviews);
            expect(mockRepo.find).toHaveBeenCalledWith({ where: { movieId: '123', isVisible: true }, relations: ['user'] });
        });
    });
});
