'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ProductSchema, MealItemSchema } from '@/lib/schemas';
import { z } from 'zod';

// Тип для ответов сервера (чтобы избежать any)
export type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Получение данных
 */
export async function getPlannerData() {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Используем upsert: если лога на сегодня нет, он создастся с лимитом 2000
  const dailyLog = await prisma.dailyLog.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      dailyLimit: 2000, // Можно позже вынести в настройки пользователя
    },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: 'desc' }, // Новые записи сверху
      },
    },
  });

  return { products, dailyLog };
}

/**
 * СОЗДАНИЕ ПРОДУКТА
 */
export async function createProductAction(
  data: z.infer<typeof ProductSchema>
): Promise<ActionResponse> {
  const validated = ProductSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.product.create({ data: validated.data });
    revalidatePath('/products');
    return { success: true, message: 'Продукт добавлен' };
  } catch (e) {
    return { success: false, message: 'Такой продукт уже существует' };
  }
}

/**
 * ДОБАВЛЕНИЕ В ДНЕВНОЙ РАЦИОН
 */
export async function addMealItemAction(
  data: z.infer<typeof MealItemSchema>
): Promise<ActionResponse> {
  const validated = MealItemSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const log = await prisma.dailyLog.upsert({
      where: { date: today },
      update: {},
      create: { date: today, dailyLimit: 2000 },
    });

    await prisma.mealItem.create({
      data: {
        productId: validated.data.productId,
        weight: validated.data.weight,
        dailyLogId: log.id,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Ошибка при добавлении в рацион' };
  }
}

/**
 * УДАЛЕНИЕ ИЗ РАЦИОНА
 */
export async function deleteMealItemAction(
  id: number
): Promise<ActionResponse> {
  try {
    await prisma.mealItem.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Не удалось удалить запись' };
  }
}

/**
 * ПОИСК ПРОДУКТОВ (Read-only)
 */
export async function getFilteredProducts(query: string) {
  if (!query || query.length < 2) return [];

  return await prisma.product.findMany({
    where: { name: { contains: query } },
    take: 10,
  });
}

/**
 * УДАЛЕНИЕ ПРОДУКТА ИЗ СПРАВОЧНИКА
 */
export async function deleteProductAction(id: number): Promise<ActionResponse> {
  try {
    // Удаление продукта также удалит все MealItems (благодаря onDelete: Cascade в схеме)
    await prisma.product.delete({ where: { id } });
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, message: 'Продукт удален' };
  } catch (e) {
    return { success: false, message: 'Не удалось удалить продукт' };
  }
}

/**
 * ИЗМЕНЕНИЕ ПРОДУКТА
 */
export async function updateProductAction(
  id: number,
  data: z.infer<typeof ProductSchema>
): Promise<ActionResponse> {
  const validated = ProductSchema.safeParse(data);
  if (!validated.success)
    return { success: false, errors: validated.error.flatten().fieldErrors };

  try {
    await prisma.product.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, message: 'Продукт обновлен' };
  } catch (e) {
    return { success: false, message: 'Ошибка обновления' };
  }
}
