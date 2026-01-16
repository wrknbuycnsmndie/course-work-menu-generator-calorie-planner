'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ProductSchema } from '@/lib/schemas';
import { z } from 'zod';

/**
 * Создает новый продукт в справочнике.
 * * @param {Object} data - Данные продукта (название, калории, категория).
 */
export async function createProductAction(data: z.infer<typeof ProductSchema>) {
  const validated = ProductSchema.safeParse(data);
  if (!validated.success)
    return { success: false, errors: validated.error.flatten().fieldErrors };

  try {
    await prisma.product.create({ data: validated.data });
    revalidatePath('/products');
    return { success: true, message: 'Продукт создан' };
  } catch (e) {
    return {
      success: false,
      message: 'Ошибка: название должно быть уникальным',
    };
  }
}

/**
 * Обновляет данные существующего продукта.
 * * @param {number} id - ID продукта в БД.
 * @param {Object} data - Новые данные для обновления.
 */
export async function updateProductAction(
  id: number,
  data: z.infer<typeof ProductSchema>
) {
  const validated = ProductSchema.safeParse(data);
  if (!validated.success)
    return { success: false, errors: validated.error.flatten().fieldErrors };

  try {
    await prisma.product.update({ where: { id }, data: validated.data });
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

/**
 * Удаляет продукт из справочника.
 * Внимание: связанные записи в истории будут удалены каскадно.
 * * @param {number} id - ID удаляемого продукта.
 */
export async function deleteProductAction(id: number) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
