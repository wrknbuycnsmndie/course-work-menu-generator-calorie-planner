'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface MealItemWithProduct {
  id: number;
  weight: number;
  product: {
    name: string;
    calories: number;
  };
}

interface Props {
  date: Date;
  items: MealItemWithProduct[];
}

export function DayDetailsModal({ date, items }: Props) {
  const totalCalories = items.reduce((sum, item) => {
    return sum + Math.round((item.product.calories * item.weight) / 100);
  }, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 gap-2 hover:bg-muted transition-colors'
        >
          <Eye className='h-4 w-4' />
          Детали
        </Button>
      </DialogTrigger>

      {/* Ограничиваем ширину и задаем flex для управления высотой */}
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] flex flex-col gap-0'>
        <DialogHeader className='p-6 pb-2'>
          <DialogTitle className='flex items-center gap-2 text-xl font-bold'>
            <Info className='h-5 w-5 text-primary' />
            Рацион за {format(date, 'd MMMM yyyy', { locale: ru })}
          </DialogTitle>
        </DialogHeader>

        {/* Контейнер с прокруткой. 
          overflow-y-auto позволяет таблице скроллиться внутри модалки.
        */}
        <div className='flex-1 overflow-y-auto my-2 scrollbar-thin scrollbar-thumb-muted'>
          <div className='rounded-md border overflow-hidden'>
            <Table>
              <TableHeader className='sticky top-0 bg-secondary z-10'>
                <TableRow className='hover:bg-transparent border-b'>
                  <TableHead className='py-3'>Продукт</TableHead>
                  <TableHead className='text-right py-3'>Вес</TableHead>
                  <TableHead className='text-right py-3'>Ккал</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className='text-center py-10 text-muted-foreground italic'
                    >
                      Записей за этот день нет
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => {
                    const itemCals = Math.round(
                      (item.product.calories * item.weight) / 100
                    );
                    return (
                      <TableRow key={item.id} className='hover:bg-muted/50'>
                        <TableCell className='font-medium max-w-[200px] truncate'>
                          {item.product.name}
                        </TableCell>
                        <TableCell className='text-right text-muted-foreground'>
                          {item.weight} г
                        </TableCell>
                        <TableCell className='text-right font-semibold'>
                          {itemCals}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
                {items.length > 0 && (
                  <TableRow className='bg-primary/5 font-bold sticky bottom-0 border-t-2'>
                    <TableCell colSpan={2} className='py-4'>
                      Итого за день:
                    </TableCell>
                    <TableCell className='text-right text-primary text-lg py-4'>
                      {totalCalories}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className='p-4 border-t bg-muted/20'>
          <p className='text-[10px] text-muted-foreground text-center italic leading-tight uppercase tracking-wider font-semibold opacity-70'>
            Все расчеты произведены на основе справочных данных на момент записи
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
