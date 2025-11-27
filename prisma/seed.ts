import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed regions
  const regions = await Promise.all([
    prisma.region.upsert({
      where: { code: 'sao-paulo' },
      update: {},
      create: {
        name: 'São Paulo',
        code: 'sao-paulo',
        colorHex: '#FBBF24', // Yellow
      },
    }),
    prisma.region.upsert({
      where: { code: 'minas-gerais' },
      update: {},
      create: {
        name: 'Minas Gerais',
        code: 'minas-gerais',
        colorHex: '#166534', // Dark Green
      },
    }),
    prisma.region.upsert({
      where: { code: 'goias' },
      update: {},
      create: {
        name: 'Goiás',
        code: 'goias',
        colorHex: '#1E40AF', // Dark Blue
      },
    }),
    prisma.region.upsert({
      where: { code: 'santa-catarina' },
      update: {},
      create: {
        name: 'Santa Catarina',
        code: 'santa-catarina',
        colorHex: '#F97316', // Orange
      },
    }),
  ]);
  console.log(`Created ${regions.length} regions`);

  // Seed expense categories (no daily budgets - just tracking by category)
  const categories = await Promise.all([
    prisma.expenseCategory.upsert({
      where: { name: 'Food' },
      update: {},
      create: {
        name: 'Food',
        icon: 'utensils',
        colorHex: '#EF4444',
        warningThresholdPercent: 80,
      },
    }),
    prisma.expenseCategory.upsert({
      where: { name: 'Transportation' },
      update: {},
      create: {
        name: 'Transportation',
        icon: 'car',
        colorHex: '#3B82F6',
        warningThresholdPercent: 80,
      },
    }),
    prisma.expenseCategory.upsert({
      where: { name: 'Accommodation' },
      update: {},
      create: {
        name: 'Accommodation',
        icon: 'bed',
        colorHex: '#8B5CF6',
        warningThresholdPercent: 80,
      },
    }),
    prisma.expenseCategory.upsert({
      where: { name: 'Activities' },
      update: {},
      create: {
        name: 'Activities',
        icon: 'ticket',
        colorHex: '#10B981',
        warningThresholdPercent: 80,
      },
    }),
    prisma.expenseCategory.upsert({
      where: { name: 'Shopping' },
      update: {},
      create: {
        name: 'Shopping',
        icon: 'shopping-bag',
        colorHex: '#F59E0B',
        warningThresholdPercent: 80,
      },
    }),
    prisma.expenseCategory.upsert({
      where: { name: 'Other' },
      update: {},
      create: {
        name: 'Other',
        icon: 'more-horizontal',
        colorHex: '#6B7280',
        warningThresholdPercent: 80,
      },
    }),
  ]);
  console.log(`Created ${categories.length} expense categories`);

  // Seed calendar days (January 6 - February 3, 2026)
  const startDate = new Date('2026-01-06');
  const endDate = new Date('2026-02-03');
  const calendarDays = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    calendarDays.push(
      prisma.calendarDay.upsert({
        where: { date: new Date(dateStr) },
        update: {},
        create: {
          date: new Date(dateStr),
        },
      })
    );
  }

  const createdDays = await Promise.all(calendarDays);
  console.log(`Created ${createdDays.length} calendar days`);

  // Seed app settings
  await prisma.appSettings.upsert({
    where: { id: 1 },
    update: { numberOfTravelers: 3 },
    create: {
      id: 1,
      exchangeRate: 5.4,
      totalBudgetBrl: 10000, // R$10,000 default total budget
      numberOfTravelers: 3, // 2 adults + 1 baby
    },
  });
  console.log('Created app settings');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
