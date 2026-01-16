'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import { Product } from '@prisma/client';
import { toast } from 'sonner';
import { generateMenu } from '@/lib/menu-generator';
import { addManyMealItemsAction } from '@/app/actions/planner';

interface Props {
  products: Product[];
}

export function SmartGenerator({ products }: Props) {
  const [target, setTarget] = useState<string>('600');
  const [suggestion, setSuggestion] = useState<ReturnType<
    typeof generateMenu
  > | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = () => {
    const calories = Number(target);
    if (calories < 100) return toast.error('Слишком мало калорий для обеда');

    const result = generateMenu(products, calories);
    setSuggestion(result);
  };

  const handleSave = async () => {
    if (!suggestion) return;
    setIsSaving(true);

    const items = suggestion.map((s) => ({
      productId: s.product.id,
      weight: s.weight,
    }));

    const res = await addManyMealItemsAction(items);
    if (res.success) {
      toast.success('Меню добавлено в рацион!');
      setSuggestion(null);
    }
    setIsSaving(false);
  };

  return (
    <Card className='border-primary/20 bg-primary/5'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-primary'>
          <Sparkles className='w-5 h-5' /> Умный генератор меню
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          <div className='flex-1'>
            <Input
              type='number'
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder='Цель (ккал)'
            />
          </div>
          <Button onClick={handleGenerate} variant='secondary'>
            Сгенерировать
          </Button>
        </div>

        {suggestion && (
          <div className='space-y-2 border-t pt-4'>
            <p className='text-sm font-medium'>Предложенное меню:</p>
            {suggestion.map((item, idx) => (
              <div
                key={idx}
                className='flex justify-between text-sm bg-background p-2 rounded border'
              >
                <span>
                  {item.product.name} ({item.weight}г)
                </span>
                <span className='font-mono font-bold text-primary'>
                  {item.calories} ккал
                </span>
              </div>
            ))}
            <div className='flex justify-between border-t pt-2 font-bold text-lg'>
              <span>Итого:</span>
              <span>
                {suggestion.reduce((acc, i) => acc + i.calories, 0)} ккал
              </span>
            </div>
          </div>
        )}
      </CardContent>
      {suggestion && (
        <CardFooter>
          <Button className='w-full' onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className='animate-spin mr-2' />
            ) : (
              <Check className='mr-2' />
            )}
            Добавить всё в мой дневник
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
