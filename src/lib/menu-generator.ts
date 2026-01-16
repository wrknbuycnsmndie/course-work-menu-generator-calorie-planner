import { Product, Category } from '@prisma/client';

// 1. Жесткие границы порций (чтобы не лопнуть и не голодать)
const CONSTRAINTS: Record<Category, { min: number; max: number; avg: number }> =
  {
    FIRST: { min: 250, max: 500, avg: 350 }, // Суп: обычно 350г
    SECOND: { min: 150, max: 450, avg: 300 }, // Второе: обычно 300г
    DESSERT: { min: 50, max: 250, avg: 120 }, // Десерт: обычно 120г
    DRINK: { min: 200, max: 400, avg: 250 }, // Напиток: обычно 250мл
  };

// Распределение калорий по приемам пищи (пропорции)
const CALORIE_DISTRIBUTION = {
  FIRST: 0.25, // 25%
  SECOND: 0.45, // 45% (самое сытное)
  DESSERT: 0.2, // 20%
  DRINK: 0.1, // 10%
};

const FILL_PRIORITY: Category[] = ['SECOND', 'DESSERT', 'FIRST', 'DRINK'];

/**
 * Умный подбор продукта по целевой плотности калорий.
 * Если цель высокая - ищет жирное/сытное. Если низкая - ищет легкое.
 */
function findBestProductForCalories(
  products: Product[],
  targetCategoryCalories: number,
  category: Category
): Product {
  const catParams = CONSTRAINTS[category];

  // Вычисляем ИДЕАЛЬНУЮ калорийность на 100г для достижения цели при средней порции
  // Например: нужно 600 ккал, средняя порция 300г -> ищем продукт 200 ккал/100г
  const idealDensity = (targetCategoryCalories / catParams.avg) * 100;

  // Сортируем продукты по близости к этой плотности
  const sorted = [...products].sort((a, b) => {
    const diffA = Math.abs(a.calories - idealDensity);
    const diffB = Math.abs(b.calories - idealDensity);
    return diffA - diffB;
  });

  // Берем топ-3 подходящих и выбираем случайно среди них,
  // чтобы меню не было всегда одинаковым для одних и тех же цифр
  const topCandidates = sorted.slice(0, 3);
  return topCandidates[Math.floor(Math.random() * topCandidates.length)];
}

export function generateMenu(allProducts: Product[], targetCalories: number) {
  const menu: {
    product: Product;
    weight: number;
    calories: number;
    category: Category;
  }[] = [];
  let currentTotalCalories = 0;

  // --- ЭТАП 1: Умный выбор продуктов ---
  (['FIRST', 'SECOND', 'DESSERT', 'DRINK'] as Category[]).forEach((cat) => {
    const categoryProducts = allProducts.filter((p) => p.category === cat);
    if (categoryProducts.length === 0) return;

    // Сколько калорий мы хотим от этой категории в идеале?
    const targetCatCals = targetCalories * CALORIE_DISTRIBUTION[cat];

    // Ищем продукт, который при нормальной порции даст столько калорий
    const bestProduct = findBestProductForCalories(
      categoryProducts,
      targetCatCals,
      cat
    );

    // Считаем вес для этого продукта
    let weight = (targetCatCals / bestProduct.calories) * 100;

    // Обрезаем вес по границам реальности
    const limits = CONSTRAINTS[cat];
    weight = Math.max(limits.min, Math.min(weight, limits.max));
    weight = Math.round(weight / 10) * 10; // Округляем до 10г

    const cals = Math.round((bestProduct.calories * weight) / 100);
    currentTotalCalories += cals;

    menu.push({ product: bestProduct, weight, calories: cals, category: cat });
  });

  // --- ЭТАП 2: Балансировка (Добиваем остаток) ---
  // Если мы выбрали сытные продукты, но все равно не добрали из-за лимита веса,
  // начинаем увеличивать порции самых "выгодных" категорий.

  let deficit = targetCalories - currentTotalCalories;

  if (deficit > 30) {
    for (const cat of FILL_PRIORITY) {
      const item = menu.find((i) => i.category === cat);
      if (!item) continue;

      const limits = CONSTRAINTS[cat];
      const remainingWeightRoom = limits.max - item.weight;

      if (remainingWeightRoom > 0) {
        // Сколько веса добавить, чтобы закрыть дефицит?
        const weightNeeded = (deficit / item.product.calories) * 100;

        // Добавляем, сколько влезает или сколько нужно
        const addWeight = Math.min(remainingWeightRoom, weightNeeded);
        const roundedAdd = Math.round(addWeight / 10) * 10;

        if (roundedAdd > 0) {
          item.weight += roundedAdd;
          const addedCals = Math.round(
            (item.product.calories * roundedAdd) / 100
          );
          item.calories += addedCals;
          deficit -= addedCals;
        }
      }
      if (deficit < 30) break; // Попали в цель
    }
  }

  // Чистим результат от служебных полей
  return menu.map(({ product, weight, calories }) => ({
    product,
    weight,
    calories,
  }));
}
