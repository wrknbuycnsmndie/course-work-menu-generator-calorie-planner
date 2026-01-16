'use server';

import { prisma } from '@/lib/prisma';

/**
 * Получает историю логов питания за последние 30 дней.
 * Используется для отображения графиков и списка прошедших периодов.
 * * @returns {Promise<Array>} Список DailyLog с вложенными MealItems и продуктами.
 */
export async function getHistoryData() {
  return await prisma.dailyLog.findMany({
    orderBy: { date: 'desc' },
    include: {
      items: {
        include: { product: true },
      },
    },
    take: 30,
  });
}
