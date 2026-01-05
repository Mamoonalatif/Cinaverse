import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieCache } from '../entities/movie-cache.entity';
import { ParentalSettings } from '../entities/parental-settings.entity';
import { ChildProfile } from '../entities/child-profile.entity';
import { of } from 'rxjs';

describe('MoviesService', () => {
    let service: MoviesService;
    let mockHttp;
    let mockConfig;
    let mockCacheRepo;
    let mockParentalRepo;
    let mockChildRepo;

    beforeEach(async () => {
        mockHttp = {
            axiosRef: { get: jest.fn() },
        };
        mockConfig = {
            get: jest.fn(() => 'mock-api-key'),
        };
        mockCacheRepo = {
            findOne: jest.fn(),
            upsert: jest.fn(),
        };
        mockParentalRepo = {
            findOne: jest.fn(),
        };
        mockChildRepo = {
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MoviesService,
                { provide: HttpService, useValue: mockHttp },
                { provide: ConfigService, useValue: mockConfig },
                { provide: getRepositoryToken(MovieCache), useValue: mockCacheRepo },
                { provide: getRepositoryToken(ParentalSettings), useValue: mockParentalRepo },
                { provide: getRepositoryToken(ChildProfile), useValue: mockChildRepo },
            ],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
    });

    describe('filterList (AT-02)', () => {
        it('should filter out adult content for children under 18', async () => {
            const mockMovies = {
                results: [
                    { id: 1, title: 'Kids Movie', adult: false, genre_ids: [16] },
                    { id: 2, title: 'Adult Movie', adult: true, genre_ids: [28] },
                ],
            };

            // Mock Cache Miss to force API call
            mockHttp.axiosRef.get.mockResolvedValue({ data: mockMovies });

            const childProfile = { id: 1, age: 10, allowedGenres: '', maxAgeRating: 'PG' };
            mockChildRepo.findOne.mockResolvedValue(childProfile);

            const result = await service.search('something', 1, 1); // userId 1, childId 1

            expect(result.results.length).toBe(1);
            expect(result.results[0].id).toBe(1);
        });

        it('should filter by allowed genres', async () => {
            const mockMovies = {
                results: [
                    { id: 1, title: 'Action Movie', adult: false, genre_ids: [28] }, // Action
                    { id: 2, title: 'Comedy Movie', adult: false, genre_ids: [35] }, // Comedy
                ],
            };

            mockHttp.axiosRef.get.mockResolvedValue({ data: mockMovies });

            // Allowed only Comedy (35)
            const childProfile = { id: 1, age: 10, allowedGenres: '35', maxAgeRating: 'PG' };
            mockChildRepo.findOne.mockResolvedValue(childProfile);

            const result = await service.search('something', 1, 1);

            expect(result.results.length).toBe(1);
            expect(result.results[0].id).toBe(2);
        });
    });
});
