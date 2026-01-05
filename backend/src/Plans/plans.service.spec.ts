import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Plan } from '../entities/plan.entity';
import { Subscription } from '../entities/subscription.entity';
import { Payment } from '../entities/payment.entity';
import { ConfigService } from '@nestjs/config';

describe('PlansService', () => {
    let service: PlansService;
    let mockPlansRepo;
    let mockSubsRepo;
    let mockPaymentsRepo;

    beforeEach(async () => {
        mockPlansRepo = {
            findOne: jest.fn(),
            find: jest.fn(),
        };
        mockSubsRepo = {
            update: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
        };
        mockPaymentsRepo = {
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlansService,
                { provide: getRepositoryToken(Plan), useValue: mockPlansRepo },
                { provide: getRepositoryToken(Subscription), useValue: mockSubsRepo },
                { provide: getRepositoryToken(Payment), useValue: mockPaymentsRepo },
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        service = module.get<PlansService>(PlansService);
    });

    describe('calculateProration (Update Subscription)', () => { // Matches AT-04
        it('should deactivate old subscription and create new one', async () => {
            const oldPlan = { id: 1, name: 'Basic', price: 1000 };
            const newPlan = { id: 2, name: 'Premium', price: 2000 };

            mockPlansRepo.findOne.mockResolvedValue(newPlan);
            mockSubsRepo.save.mockResolvedValue({ plan: newPlan, endDate: new Date() });

            const result = await service.updateUserSubscription(1, 'Premium');

            expect(mockSubsRepo.update).toHaveBeenCalledWith(
                { user: { id: 1 }, status: 'active' },
                expect.objectContaining({ status: 'inactive' })
            );

            expect(mockSubsRepo.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    user: { id: 1 },
                    plan: newPlan
                })
            );

            expect(result.plan).toBe('Premium');
        });
    });
});
