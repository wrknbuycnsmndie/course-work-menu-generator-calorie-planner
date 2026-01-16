import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: 'Куриная грудка (отварная)', calories: 165 },
    { name: 'Рис басмати', calories: 130 },
    { name: 'Яблоко красное', calories: 52 },
    { name: 'Овсянка на воде', calories: 68 },
    { name: 'Гречка', calories: 110 },
    { name: 'Творог 5%', calories: 121 },
    { name: 'Банан', calories: 89 },
    { name: 'Яйцо куриное (1 шт)', calories: 157 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }
  console.log('База данных успешно наполнена!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
