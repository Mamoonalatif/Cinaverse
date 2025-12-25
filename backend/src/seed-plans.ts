import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Plan } from './entities/plan.entity';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? true : undefined,
  host: process.env.DATABASE_URL ? undefined : process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_URL ? undefined : process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_URL ? undefined : process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_URL ? undefined : process.env.DATABASE_NAME || 'cinaverse',
  entities: [Plan],
  synchronize: false,
});

async function seed() {
  console.log('🌱 Seeding plans...');
  
  await AppDataSource.initialize();
  const planRepo = AppDataSource.getRepository(Plan);

  const plans = [
    {
      name: 'Basic',
      price: 999, // $9.99 in cents
      description: 'HD Streaming | Watch on 1 device | Cancel anytime',
    },
    {
      name: 'Premium',
      price: 1499, // $14.99
      description: '4K Streaming | Watch on 4 devices | Download content | Cancel anytime',
    },
    {
      name: 'Enterprise',
      price: 2999, // $29.99
      description: '4K Streaming | Unlimited devices | Download content | Priority support | Cancel anytime',
    },
  ];

  for (const planData of plans) {
    const existing = await planRepo.findOne({ where: { name: planData.name } });
    if (!existing) {
      await planRepo.save(planData);
      console.log(`✓ Created plan: ${planData.name} ($${planData.price / 100})`);
    } else {
      console.log(`⊘ Plan already exists: ${planData.name}`);
    }
  }

  await AppDataSource.destroy();
  console.log('✅ Seed complete');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
