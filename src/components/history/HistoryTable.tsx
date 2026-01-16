'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { StatusBadge } from './StatusBadge';
import { DayDetailsModal } from './DayDetailsModal';

interface HistoryDay {
  id: number;
  date: Date;
  dailyLimit: number;
  items: {
    id: number;
    weight: number;
    product: {
      name: string;
      calories: number;
    };
  }[];
}

interface Props {
  logs: HistoryDay[];
}

export function HistoryTable({ logs }: Props) {
  return (
    <Card className='border-none shadow-none sm:border sm:shadow-sm'>
      <CardContent className='p-0 sm:p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                {/* Адаптивная ширина колонки с датой */}
                <TableHead className='w-[140px] md:w-[200px]'>Дата</TableHead>
                <TableHead>Результат</TableHead>
                {/* Скрываем статус на совсем маленьких экранах (до 400px) или оставляем только значок */}
                <TableHead className='text-right hidden xs:table-cell'>
                  Статус
                </TableHead>
                <TableHead className='text-right'>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='h-32 text-center text-muted-foreground'
                  >
                    История пуста. Начните планировать рацион на главной.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => {
                  const totalConsumed = log.items.reduce((sum, item) => {
                    return (
                      sum +
                      Math.round((item.product.calories * item.weight) / 100)
                    );
                  }, 0);

                  return (
                    <TableRow
                      key={log.id}
                      className='hover:bg-muted/30 transition-colors'
                    >
                      <TableCell className='font-medium capitalize py-4'>
                        {/* Короткий формат для мобилок, полный для десктопа */}
                        <span className='md:hidden'>
                          {format(log.date, 'd MMM', { locale: ru })}
                        </span>
                        <span className='hidden md:inline'>
                          {format(log.date, 'eeee, d MMM', { locale: ru })}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className='flex flex-col md:flex-row md:items-baseline'>
                          <span className='font-bold text-base md:text-lg'>
                            {totalConsumed}
                          </span>
                          <span className='text-muted-foreground text-[10px] md:text-xs md:ml-1 uppercase tracking-tighter'>
                            из {log.dailyLimit}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className='text-right hidden xs:table-cell'>
                        <StatusBadge
                          consumed={totalConsumed}
                          limit={log.dailyLimit}
                        />
                      </TableCell>

                      <TableCell className='text-right'>
                        <DayDetailsModal date={log.date} items={log.items} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
