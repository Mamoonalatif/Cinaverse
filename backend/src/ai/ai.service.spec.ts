import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ConfigService } from '@nestjs/config';

// Mock the GoogleGenerativeAI class
const mockGenerateContent = jest.fn();
jest.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => {
            return {
                getGenerativeModel: jest.fn().mockReturnValue({
                    generateContent: mockGenerateContent,
                }),
            };
        }),
    };
});

describe('AiService', () => {
    let service: AiService;
    let mockConfig;

    beforeEach(async () => {
        mockConfig = {
            get: jest.fn(() => 'mock-api-key'),
        };
        mockGenerateContent.mockReset();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AiService,
                { provide: ConfigService, useValue: mockConfig },
            ],
        }).compile();

        service = module.get<AiService>(AiService);
    });

    describe('sanitizePrompt (getMovieRecommendations)', () => { // Matches AT-05
        it('should return AI text when successful', async () => {
            mockGenerateContent.mockResolvedValue({
                response: {
                    text: () => 'Recommended Movie: Wall-E'
                }
            });

            const result = await service.getMovieRecommendations('space movie');
            expect(result.text).toBe('Recommended Movie: Wall-E');
        });

        it('should handle errors gracefully (Network/Safety)', async () => {
            mockGenerateContent.mockRejectedValue(new Error('Safety violation'));

            const result = await service.getMovieRecommendations('unsafe input');
            // The service catches error and returns fallback
            expect(result.text).toContain("My brain is fuzzy");
        });
    });
});
