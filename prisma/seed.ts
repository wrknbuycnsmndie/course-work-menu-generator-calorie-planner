import { Category } from '@prisma/client';
import { prisma } from '../src/lib/prisma';

async function main() {
  const products = [
    // --- ПЕРВОЕ (FIRST) ---
    { name: 'Борщ с говядиной', calories: 65, category: Category.FIRST },
    { name: 'Щи из свежей капусты', calories: 45, category: Category.FIRST },
    { name: 'Суп-пюре из тыквы', calories: 55, category: Category.FIRST },
    { name: 'Грибной крем-суп', calories: 75, category: Category.FIRST },
    { name: 'Куриный бульон с лапшой', calories: 50, category: Category.FIRST },
    { name: 'Солянка мясная', calories: 95, category: Category.FIRST },
    {
      name: 'Гороховый суп с копченостями',
      calories: 85,
      category: Category.FIRST,
    },
    { name: 'Уха из лосося', calories: 70, category: Category.FIRST },
    { name: 'Чечевичный суп', calories: 60, category: Category.FIRST },
    { name: 'Рассольник', calories: 58, category: Category.FIRST },
    { name: 'Гаспачо', calories: 35, category: Category.FIRST },
    { name: 'Мисо-суп', calories: 40, category: Category.FIRST },
    { name: 'Окрошка на кефире', calories: 48, category: Category.FIRST },
    { name: 'Сырный суп', calories: 110, category: Category.FIRST },
    {
      name: 'Томатный суп с базиликом',
      calories: 42,
      category: Category.FIRST,
    },
    { name: 'Суп харчо', calories: 80, category: Category.FIRST },
    { name: 'Минестроне', calories: 38, category: Category.FIRST },
    { name: 'Щавелевый суп', calories: 40, category: Category.FIRST },
    { name: 'Вьетнамский Фо-бо', calories: 55, category: Category.FIRST },
    { name: 'Крем-суп из брокколи', calories: 62, category: Category.FIRST },

    // --- ВТОРОЕ (SECOND) ---
    {
      name: 'Куриная грудка с гречкой',
      calories: 145,
      category: Category.SECOND,
    },
    {
      name: 'Говяжий гуляш с картофельным пюре',
      calories: 160,
      category: Category.SECOND,
    },
    {
      name: 'Котлета из индейки с рисом Басмати',
      calories: 140,
      category: Category.SECOND,
    },
    {
      name: 'Запеченная треска с овощами гриль',
      calories: 95,
      category: Category.SECOND,
    },
    {
      name: 'Свиная отбивная с макаронами',
      calories: 240,
      category: Category.SECOND,
    },
    {
      name: 'Тефтели в томате с булгуром',
      calories: 155,
      category: Category.SECOND,
    },
    { name: 'Бефстроганов с рисом', calories: 185, category: Category.SECOND },
    {
      name: 'Куриные ножки с запеченным картофелем',
      calories: 170,
      category: Category.SECOND,
    },
    {
      name: 'Стейк из лосося с диким рисом',
      calories: 190,
      category: Category.SECOND,
    },
    {
      name: 'Плов с говядиной и нутом',
      calories: 210,
      category: Category.SECOND,
    },
    {
      name: 'Индейка терияки с фунчозой',
      calories: 165,
      category: Category.SECOND,
    },
    {
      name: 'Мясная запеканка с овощами',
      calories: 130,
      category: Category.SECOND,
    },
    {
      name: 'Люля-кебаб из баранины с рисом',
      calories: 230,
      category: Category.SECOND,
    },
    {
      name: 'Куриное филе с кускусом',
      calories: 150,
      category: Category.SECOND,
    },
    {
      name: 'Гуляш из свинины с макаронами',
      calories: 205,
      category: Category.SECOND,
    },
    {
      name: 'Рыбные котлеты с киноа',
      calories: 115,
      category: Category.SECOND,
    },
    {
      name: 'Тушеная крольчатина с гречкой',
      calories: 125,
      category: Category.SECOND,
    },
    {
      name: 'Шницель куриный с пюре',
      calories: 215,
      category: Category.SECOND,
    },
    {
      name: 'Азу по-татарски с говядиной',
      calories: 175,
      category: Category.SECOND,
    },
    {
      name: 'Фрикасе из птицы с рисом',
      calories: 160,
      category: Category.SECOND,
    },

    // --- ДЕСЕРТ (DESSERT) ---
    { name: 'Чизкейк Нью-Йорк', calories: 320, category: Category.DESSERT },
    { name: 'Яблочный штрудель', calories: 210, category: Category.DESSERT },
    { name: 'Творожная запеканка', calories: 150, category: Category.DESSERT },
    { name: 'Медовик', calories: 380, category: Category.DESSERT },
    { name: 'Фруктовый салат', calories: 60, category: Category.DESSERT },
    { name: 'Брауни', calories: 450, category: Category.DESSERT },
    { name: 'Мороженое ванильное', calories: 200, category: Category.DESSERT },
    { name: 'Панна-котта', calories: 180, category: Category.DESSERT },
    { name: 'Яблоко запеченное', calories: 75, category: Category.DESSERT },
    { name: 'Сорбет лимонный', calories: 100, category: Category.DESSERT },
    { name: 'Тирамису', calories: 300, category: Category.DESSERT },
    { name: 'Овсяное печенье', calories: 420, category: Category.DESSERT },
    { name: 'Темный шоколад (30г)', calories: 165, category: Category.DESSERT },
    { name: 'Банан', calories: 89, category: Category.DESSERT },
    { name: 'Круассан', calories: 400, category: Category.DESSERT },
    { name: 'Йогурт натуральный', calories: 65, category: Category.DESSERT },
    { name: 'Профитроли', calories: 290, category: Category.DESSERT },
    { name: 'Зефир', calories: 310, category: Category.DESSERT },
    { name: 'Пудинг шоколадный', calories: 130, category: Category.DESSERT },
    { name: 'Груша в сиропе', calories: 110, category: Category.DESSERT },

    // --- НАПИТОК (DRINK) ---
    { name: 'Зеленый чай без сахара', calories: 1, category: Category.DRINK },
    { name: 'Кофе американо', calories: 2, category: Category.DRINK },
    { name: 'Капучино', calories: 45, category: Category.DRINK },
    { name: 'Апельсиновый сок', calories: 45, category: Category.DRINK },
    { name: 'Морс ягодный', calories: 35, category: Category.DRINK },
    { name: 'Компот из сухофруктов', calories: 40, category: Category.DRINK },
    { name: 'Смузи клубничный', calories: 60, category: Category.DRINK },
    { name: 'Молочный коктейль', calories: 95, category: Category.DRINK },
    { name: 'Кефир 1%', calories: 40, category: Category.DRINK },
    { name: 'Лимонад домашний', calories: 30, category: Category.DRINK },
    { name: 'Горячий шоколад', calories: 85, category: Category.DRINK },
    { name: 'Чай с лимоном и медом', calories: 25, category: Category.DRINK },
    { name: 'Вода с газом', calories: 0, category: Category.DRINK },
    { name: 'Вишневый нектар', calories: 50, category: Category.DRINK },
    { name: 'Латте макиато', calories: 55, category: Category.DRINK },
    { name: 'Кисель из черники', calories: 55, category: Category.DRINK },
    { name: 'Томатный сок', calories: 20, category: Category.DRINK },
    { name: 'Мятный чай', calories: 2, category: Category.DRINK },
    { name: 'Какао на молоке', calories: 70, category: Category.DRINK },
    { name: 'Гранатовый сок', calories: 54, category: Category.DRINK },
  ];

  console.log('Начало наполнения базы...');

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {
        category: product.category,
        calories: product.calories,
      },
      create: product,
    });
  }

  console.log(`Успешно добавлено/обновлено ${products.length} продуктов.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
