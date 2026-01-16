'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { MealItemSchema } from '@/lib/schemas';
import { z } from 'zod';

/**
 * Получает данные для планировщика на текущий день.
 * Если лог на сегодня отсутствует, создает его (upsert).
 * * @returns {Object} Объект с массивом всех продуктов и текущим логом дня.
 */
export async function getPlannerData() {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyLog = await prisma.dailyLog.upsert({
    where: { date: today },
    update: {},
    create: { date: today, dailyLimit: 2000 },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: 'desc' },
      },
    },
  });

  return { products, dailyLog };
}

/**
 * Добавляет один продукт в рацион текущего дня.
 * * @param {Object} data - Данные из формы (productId и weight).
 * @returns {Promise<{success: boolean}>} Статус выполнения операции.
 */
export async function addMealItemAction(data: z.infer<typeof MealItemSchema>) {
  const validated = MealItemSchema.safeParse(data);
  if (!validated.success) return { success: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const log = await prisma.dailyLog.upsert({
      where: { date: today },
      update: {},
      create: { date: today },
    });

    await prisma.mealItem.create({
      data: { ...validated.data, dailyLogId: log.id },
    });

    revalidatePath('/');
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

/**
 * Массово добавляет несколько продуктов в рацион.
 * Используется "Умным генератором" для добавления комплексного обеда.
 * * @param {Array<{productId: number, weight: number}>} items - Массив объектов продуктов.
 */
export async function addManyMealItemsAction(
  items: { productId: number; weight: number }[]
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const log = await prisma.dailyLog.upsert({
      where: { date: today },
      update: {},
      create: { date: today },
    });

    await prisma.mealItem.createMany({
      data: items.map((item) => ({
        ...item,
        dailyLogId: log.id,
      })),
    });

    revalidatePath('/');
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function updateDailyLimitAction(
  logId: number | undefined,
  newLimit: number
) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.dailyLog.upsert({
      where: { date: today },
      update: { dailyLimit: newLimit },
      create: {
        date: today,
        dailyLimit: newLimit,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
