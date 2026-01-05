import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginLogService } from '../logs/login-log.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let mockRepo;
    let mockJwt;
    let mockLogService;

    beforeEach(async () => {
        mockRepo = {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
        };
        mockJwt = {
            sign: jest.fn(() => 'mock-token'),
        };
        mockLogService = {
            createLoginLog: jest.fn().mockResolvedValue(true),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(User), useValue: mockRepo },
                { provide: JwtService, useValue: mockJwt },
                { provide: LoginLogService, useValue: mockLogService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser (login)', () => { // Matches AT-01
        it('should validate user and return token', async () => {
            const password = 'password123';
            const hash = await bcrypt.hash(password, 10);
            const user = { id: 1, email: 'test@test.com', password: hash, role: 'user' };

            mockRepo.findOne.mockResolvedValue(user);

            const result = await service.login('test@test.com', password);

            expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
            expect(result.access_token).toBe('mock-token');
            expect(result.user.email).toBe('test@test.com');
        });

        it('should throw UnauthorizedException for wrong password', async () => {
            const password = 'password123';
            const hash = await bcrypt.hash(password, 10);
            const user = { id: 1, email: 'test@test.com', password: hash };

            mockRepo.findOne.mockResolvedValue(user);

            await expect(service.login('test@test.com', 'wrongpassword'))
                .rejects
                .toThrow('Invalid credentials');
        });
    });
});
