import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed regions (Earthy tones)
  const regions = await Promise.all([
    prisma.region.upsert({
      where: { code: 'sao-paulo' },
      update: { colorHex: '#C9A227' },
      create: {
        name: 'São Paulo',
        code: 'sao-paulo',
        colorHex: '#C9A227', // Golden ochre
      },
    }),
    prisma.region.upsert({
      where: { code: 'minas-gerais' },
      update: { colorHex: '#2D5A3D' },
      create: {
        name: 'Minas Gerais',
        code: 'minas-gerais',
        colorHex: '#2D5A3D', // Forest green
      },
    }),
    prisma.region.upsert({
      where: { code: 'goias' },
      update: { colorHex: '#8B6914' },
      create: {
        name: 'Goiás',
        code: 'goias',
        colorHex: '#8B6914', // Bronze/olive
      },
    }),
    prisma.region.upsert({
      where: { code: 'santa-catarina' },
      update: { colorHex: '#B85C38' },
      create: {
        name: 'Santa Catarina',
        code: 'santa-catarina',
        colorHex: '#B85C38', // Terracotta
      },
    }),
  ]);
  console.log(`Created ${regions.length} regions`);

  // Seed expense categories (Earthy tones)
  const categories = await Promise.all([
    prisma.expenseCategory.upsert({
      where: { name: 'Food' },
      update: { colorHex: '#B85C38' },
      create: {
        name: 'Food',
        icon: 'utensils',
        colorHex: '#B85C38', // Terracotta
        warningThresholdPercent: 80,
      },
    }),
    prisma.expenseCategory.upsert({
      where: { name: 'Transportation' },
      update: { colorHex: '#5C7A6B' },
      create: {
        name: 'Transportation',
        icon: 'car',
        colorHex: '#5C7A6B', // Sage green
        warningThresholdPercent: 80,
      },
    }),
    prisma.expenseCategory.upsert({
      where: { name: 'Accommodation' },
      update: { colorHex: '#8B6914' },
      create: {
        name: 'Accommodation',
        icon: 'bed',
        colorHex: '#8B6914', // Bronze
        warningThresholdPercent: 80,
      },
    }),
    prisma.expenseCategory.upsert({
      where: { name: 'Activities' },
      update: { colorHex: '#2D5A3D' },
      create: {
        name: 'Activities',
        icon: 'ticket',
        colorHex: '#2D5A3D', // Forest green
        warningThresholdPercent: 80,
      },
    }),
    prisma.expenseCategory.upsert({
      where: { name: 'Shopping' },
      update: { colorHex: '#C9A227' },
      create: {
        name: 'Shopping',
        icon: 'shopping-bag',
        colorHex: '#C9A227', // Golden ochre
        warningThresholdPercent: 80,
      },
    }),
    prisma.expenseCategory.upsert({
      where: { name: 'Other' },
      update: { colorHex: '#8B7355' },
      create: {
        name: 'Other',
        icon: 'more-horizontal',
        colorHex: '#8B7355', // Warm taupe
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
