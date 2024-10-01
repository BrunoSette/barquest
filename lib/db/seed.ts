import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users, teams, teamMembers } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const barristerProduct = await stripe.products.create({
    name: 'BarQuest - Barrister',
    description: 'BarQuest - Barrister subscription plan',
  });

  await stripe.prices.create({
    product: barristerProduct.id,
    unit_amount: 3900, // $39 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const solicitorProduct = await stripe.products.create({
    name: 'BarQuest - Solicitor',
    description: 'BarQuest - Solicitor subscription plan',
  });

  await stripe.prices.create({
    product: solicitorProduct.id,
    unit_amount: 3900, // $39 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const fullProduct = await stripe.products.create({
    name: 'BarQuest - Full',
    description: 'BarQuest - Full subscription plan',
  });

  await stripe.prices.create({
    product: fullProduct.id,
    unit_amount: 6900, // $69 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values([
      {
        email: email,
        passwordHash: passwordHash,
        role: "owner",
      },
    ])
    .returning();

  console.log('Initial user created.');

  const [team] = await db
    .insert(teams)
    .values({
      name: 'Test Team',
    })
    .returning();

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: 'owner',
  });

  await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
