import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
    let controller: MoviesController;
    let mockService;

    beforeEach(async () => {
        mockService = {
            search: jest.fn(),
            getTrending: jest.fn(),
            getPopular: jest.fn(),
            getLatestReleases: jest.fn(),
            getGenres: jest.fn(),
            getDetails: jest.fn(),
            getTrailer: jest.fn(),
            getSimilarMovies: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [
                { provide: MoviesService, useValue: mockService },
            ],
        }).compile();

        controller = module.get<MoviesController>(MoviesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getTrending', () => {
        it('should return trending movies', async () => {
            const result = { results: [] };
            mockService.getTrending.mockResolvedValue(result);
            expect(await controller.getTrending({ id: 1 } as any)).toBe(result);
        });
    });

    describe('getDetails', () => {
        it('should return movie details', async () => {
            const result = { id: 123, title: 'Test Movie' };
            mockService.getDetails.mockResolvedValue(result);
            expect(await controller.getDetails({ id: 1 } as any, undefined, '123')).toBe(result);
        });
    });
});
