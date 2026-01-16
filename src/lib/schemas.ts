import { z } from 'zod';
import { Category } from '@prisma/client';

export const ProductSchema = z.object({
  name: z.string().min(2, 'Название должно быть не менее 2 символов'),
  calories: z.coerce
    .number()
    .positive('Калории должны быть положительным числом'),
  category: z.enum(Category, {
    message: 'Выберите корректную категорию из списка',
  }),
});

export const MealItemSchema = z.object({
  productId: z.coerce.number().int(),
  weight: z.coerce.number().positive('Вес должен быть больше 0'),
});
