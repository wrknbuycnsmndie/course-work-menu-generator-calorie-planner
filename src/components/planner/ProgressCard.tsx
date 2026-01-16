'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, TrendingUp, AlertCircle, Edit2 } from 'lucide-react';

import type { DailyLog, MealItem, Product } from '@prisma/client';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateDailyLimitAction } from '@/app/actions/planner';
import { Input } from '../ui/input';

// Тип для лога со всеми связями
export type DailyLogWithItems = DailyLog & {
  items: (MealItem & {
    product: Product;
  })[];
};

interface Props {
  log: DailyLogWithItems | null;
}

export function ProgressCard({ log }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLimit, setTempLimit] = useState(
    log?.dailyLimit?.toString() ?? '2000'
  );

  const limit = log?.dailyLimit ?? 2000;

  const consumed =
    log?.items?.reduce((sum: number, item: any) => {
      return sum + (item.product.calories * item.weight) / 100;
    }, 0) ?? 0;

  const roundedConsumed = Math.round(consumed);
  const remaining = limit - roundedConsumed;
  const progressPercent = Math.min((roundedConsumed / limit) * 100, 100);
  const isOverLimit = roundedConsumed > limit;

  async function handleLimitSubmit() {
    const newLimit = parseInt(tempLimit);
    if (isNaN(newLimit) || newLimit <= 0) {
      toast.error('Введите корректное число');
      return;
    }

    const result = await updateDailyLimitAction(log?.id, newLimit);
    if (result.success) {
      toast.success('Лимит обновлен');
      setIsEditing(false);
    } else {
      toast.error('Ошибка сохранения');
    }
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {/* Основная карточка с прогрессом */}
      <Card className='md:col-span-2 lg:col-span-2'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>
            Энергетический баланс
          </CardTitle>
          <Flame
            className={`h-4 w-4 ${
              isOverLimit ? 'text-destructive' : 'text-orange-500'
            }`}
          />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold flex items-center gap-2'>
            {roundedConsumed}
            <span className='text-sm font-normal text-muted-foreground'>/</span>

            {isEditing ? (
              <Input
                className='h-8 w-24'
                type='number'
                value={tempLimit}
                autoFocus
                onChange={(e) => setTempLimit(e.target.value)}
                onBlur={handleLimitSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleLimitSubmit()}
              />
            ) : (
              <div
                className='flex items-center gap-1 cursor-pointer hover:text-primary transition-colors'
                onClick={() => setIsEditing(true)}
              >
                <span className='text-sm font-normal text-muted-foreground'>
                  {limit} ккал
                </span>
                <Edit2 className='h-3 w-3 text-muted-foreground' />
              </div>
            )}
          </div>

          <Progress
            value={progressPercent}
            className={`h-2 mt-4 ${
              isOverLimit ? '[&>div]:bg-destructive' : ''
            }`}
          />
          <p className='text-xs text-muted-foreground mt-2'>
            {isOverLimit
              ? `Превышение на ${Math.abs(remaining)} ккал!`
              : `Осталось употребить ${remaining} ккал`}
          </p>
        </CardContent>
      </Card>

      {/* Карточка статуса */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium'>Статус дня</CardTitle>
          {isOverLimit ? (
            <AlertCircle className='h-4 w-4 text-destructive' />
          ) : (
            <TrendingUp className='h-4 w-4 text-green-500' />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-xl font-bold ${
              isOverLimit ? 'text-destructive' : 'text-green-600'
            }`}
          >
            {isOverLimit ? 'Лимит превышен' : 'В пределах нормы'}
          </div>
          <p className='text-xs text-muted-foreground mt-1'>
            На основе введенных данных
          </p>
        </CardContent>
      </Card>

      {/* Карточка эффективности (для объема в отчете) */}
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-medium'>Кол-во приемов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{log?.items?.length ?? 0}</div>
          <p className='text-xs text-muted-foreground mt-1'>
            Записей в рационе сегодня
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
