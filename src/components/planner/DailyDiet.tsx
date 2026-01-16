'use client';

import { Trash2, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteMealItemAction } from '@/app/actions';

interface DietItem {
  id: number;
  weight: number;
  product: {
    name: string;
    calories: number;
  };
}

interface Props {
  items: DietItem[];
}

export function DailyDiet({ items }: Props) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Utensils className='w-5 h-5' /> Ваш рацион сегодня
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {items.map((item) => {
            const itemCalories = Math.round(
              (item.product.calories * item.weight) / 100
            );

            return (
              <div
                key={item.id}
                className='flex items-center justify-between p-3 bg-secondary/30 rounded-lg group'
              >
                <div>
                  <p className='font-medium text-sm'>{item.product.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {item.weight}г —{' '}
                    <span className='font-semibold text-foreground'>
                      {itemCalories} ккал
                    </span>
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='opacity-0 group-hover:opacity-100 transition-opacity text-destructive'
                  onClick={() => deleteMealItemAction(item.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className='text-center py-10 text-sm text-muted-foreground italic'>
              Вы еще ничего не добавили в план на сегодня
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
