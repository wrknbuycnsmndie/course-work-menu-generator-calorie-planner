'use client';

import { useState } from 'react';
import { Plus, Search, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Product, Category } from '@prisma/client';
import { addMealItemAction } from '@/app/actions/planner';

// Словарь для перевода категорий
const categoryLabels: Record<Category, string> = {
  FIRST: 'Первое',
  SECOND: 'Второе',
  DESSERT: 'Десерт',
  DRINK: 'Напиток',
};

interface Props {
  products: Product[];
}

export function ProductSelector({ products }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Utensils className='w-5 h-5' /> Добавить в меню
        </CardTitle>
        <div className='relative mt-2'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Поиск продукта...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-8'
          />
        </div>
      </CardHeader>
      <CardContent className='space-y-4 max-h-[500px] overflow-y-auto'>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className='flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors'
          >
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1'>
                <p className='font-semibold leading-none'>{product.name}</p>
                {/* Отображение категории в виде значка */}
                <Badge variant='secondary' className='text-[10px] px-1.5 py-0'>
                  {categoryLabels[product.category]}
                </Badge>
              </div>
              <p className='text-xs text-muted-foreground'>
                {product.calories} ккал / 100г
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex flex-col items-end gap-1'>
                <span className='text-[10px] text-muted-foreground mr-1'>
                  Вес (г)
                </span>
                <Input
                  type='number'
                  defaultValue='100'
                  className='w-20 h-8 text-sm'
                  id={`weight-${product.id}`}
                />
              </div>
              <Button
                size='sm'
                variant='outline'
                className='mt-4'
                onClick={async () => {
                  const input = document.getElementById(
                    `weight-${product.id}`
                  ) as HTMLInputElement;
                  const weight = Number(input.value);
                  await addMealItemAction({ productId: product.id, weight });
                }}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
