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

// Описываем структуру данных, которую ожидаем (из Prisma)
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
        <Button variant='ghost' size='sm' className='h-8 gap-2'>
          <Eye className='h-4 w-4' />
          Детали
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Info className='h-5 w-5 text-primary' />
            Рацион за {format(date, 'd MMMM yyyy', { locale: ru })}
          </DialogTitle>
        </DialogHeader>

        <div className='py-4'>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50'>
                  <TableHead>Продукт</TableHead>
                  <TableHead className='text-right'>Вес</TableHead>
                  <TableHead className='text-right'>Ккал</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className='text-center py-6 text-muted-foreground italic'
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
                      <TableRow key={item.id}>
                        <TableCell className='font-medium'>
                          {item.product.name}
                        </TableCell>
                        <TableCell className='text-right'>
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
                  <TableRow className='bg-muted/30 font-bold'>
                    <TableCell colSpan={2}>Итого за день:</TableCell>
                    <TableCell className='text-right text-primary'>
                      {totalCalories} ккал
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className='text-xs text-muted-foreground text-center italic'>
          Все расчеты произведены на основе калорийности продуктов в справочнике
          на момент записи.
        </div>
      </DialogContent>
    </Dialog>
  );
}
