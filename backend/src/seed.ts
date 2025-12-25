import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Watchlist } from './entities/watchlist.entity';
import { Review } from './entities/review.entity';
import { MovieCache } from './entities/movie-cache.entity';
import { ParentalSettings } from './entities/parental-settings.entity';
import { Plan } from './entities/plan.entity';
import { Subscription } from './entities/subscription.entity';
import { Payment } from './entities/payment.entity';
import { Log } from './entities/log.entity';
import { ChildProfile } from './entities/child-profile.entity';

function buildDataSource() {
  const url = process.env.DATABASE_URL;
  const common = {
    type: 'postgres' as const,
    entities: [
      User,
      Role,
      Watchlist,
      Review,
      MovieCache,
      ParentalSettings,
      Plan,
      Subscription,
      Payment,
      Log,
      ChildProfile,
    ],
    synchronize: false,
    logging: false,
  };
  if (url) {
    return new DataSource({ ...common, url, ssl: true });
  }
  return new DataSource({
    ...common,
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 5432),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'cinaverse',
  });
}

async function main() {
  const ds = buildDataSource();
  await ds.initialize();
  const runner = ds.createQueryRunner();

  // Reset tables (keeps schema) in a safe order using cascade.
  await runner.query(
    'TRUNCATE TABLE "payment", "subscription", "watchlist", "review", "movie_cache", "log", "child_profile", "parental_settings", "user", "role", "plan" RESTART IDENTITY CASCADE;'
  );

  const roleRepo = ds.getRepository(Role);
  const userRepo = ds.getRepository(User);
  const parentalRepo = ds.getRepository(ParentalSettings);
  const childRepo = ds.getRepository(ChildProfile);
  const watchRepo = ds.getRepository(Watchlist);
  const reviewRepo = ds.getRepository(Review);
  const planRepo = ds.getRepository(Plan);
  const subRepo = ds.getRepository(Subscription);
  const payRepo = ds.getRepository(Payment);
  const logRepo = ds.getRepository(Log);

  // Roles
  const [adminRole, parentRole, userRole] = await roleRepo.save([
    roleRepo.create({ name: 'admin' }),
    roleRepo.create({ name: 'parent' }),
    roleRepo.create({ name: 'user' }),
  ]);

  const hash = async (pw: string) => bcrypt.hash(pw, 10);

  // Users (Pakistani names)
  const adminAisha = userRepo.create({ email: 'aisha.khan@cinaverse.pk', password: await hash('Passw0rd!'), role: adminRole.name });
  const adminHamza = userRepo.create({ email: 'hamza.rauf@cinaverse.pk', password: await hash('Passw0rd!'), role: adminRole.name });
  const parentFarah = userRepo.create({ email: 'farah.noor@cinaverse.pk', password: await hash('Passw0rd!'), role: parentRole.name });
  const parentImran = userRepo.create({ email: 'imran.ali@cinaverse.pk', password: await hash('Passw0rd!'), role: parentRole.name });
  const userSara = userRepo.create({ email: 'sara.ahmed@cinaverse.pk', password: await hash('Passw0rd!'), role: userRole.name });
  const userBilal = userRepo.create({ email: 'bilal.hussain@cinaverse.pk', password: await hash('Passw0rd!'), role: userRole.name });

  const [aisha, hamza, farah, imran, sara, bilal] = await userRepo.save([
    adminAisha,
    adminHamza,
    parentFarah,
    parentImran,
    userSara,
    userBilal,
  ]);

  // Parental settings for parents
  await parentalRepo.save([
    parentalRepo.create({ user: farah, minAge: 12, bannedGenres: 'horror,thriller' }),
    parentalRepo.create({ user: imran, minAge: 9, bannedGenres: 'horror' }),
  ]);

  // Child profiles
  const childProfiles = await childRepo.save([
    childRepo.create({ parent: farah, name: 'Ali', age: 9, maxAgeRating: 'PG', allowedGenres: 'animation,family,adventure' }),
    childRepo.create({ parent: farah, name: 'Hira', age: 13, maxAgeRating: 'PG-13', allowedGenres: 'family,comedy,drama' }),
    childRepo.create({ parent: imran, name: 'Zara', age: 10, maxAgeRating: 'PG', allowedGenres: 'animation,family' }),
  ]);

  // Plans
  const [basicPlan, standardPlan, premiumPlan] = await planRepo.save([
    planRepo.create({ name: 'Basic', price: 69900, description: 'Mobile + SD' }),
    planRepo.create({ name: 'Standard', price: 119900, description: 'HD up to 1080p' }),
    planRepo.create({ name: 'Premium', price: 149900, description: '4K + HDR' }),
  ]);

  // Subscription and payment for Sara
  const saraSub = await subRepo.save(
    subRepo.create({ user: sara, plan: standardPlan, startDate: new Date('2024-11-01T00:00:00Z'), endDate: null })
  );
  await payRepo.save(
    payRepo.create({ user: sara, stripePaymentId: 'pi_test_123', amount: standardPlan.price, status: 'succeeded', createdAt: new Date('2024-11-01T00:00:00Z') })
  );

  // Watchlist and review examples for Bilal
  await watchRepo.save([
    watchRepo.create({ user: bilal, movieId: '872585' }),
    watchRepo.create({ user: bilal, movieId: '346698' }),
  ]);
  await reviewRepo.save(
    reviewRepo.create({ user: bilal, movieId: '872585', rating: 4, comment: 'Solid action with great pacing.' })
  );

  // Logs
  await logRepo.save([
    logRepo.create({ user: aisha, action: 'seed:init', metadata: { note: 'Admin created via seed' } }),
    logRepo.create({ user: hamza, action: 'seed:init', metadata: { note: 'Second admin created via seed' } }),
  ]);

  console.log('Seed complete. Users:', {
    admins: [aisha.email, hamza.email],
    parents: [farah.email, imran.email],
    users: [sara.email, bilal.email],
    childProfiles: childProfiles.map((c) => ({ id: c.id, name: c.name, parentEmail: c.parent.email })),
  });

  await ds.destroy();
}

main().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
