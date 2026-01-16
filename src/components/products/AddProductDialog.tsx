'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProductAction } from '@/app/actions';
import { toast } from 'sonner'; // Если используешь sonner для уведомлений
import { Category } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<string>('SECOND');

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setErrors({});

    const name = formData.get('name') as string;
    const calories = Number(formData.get('calories'));

    const result = await createProductAction({
      name,
      calories,
      category: category as Category,
    });

    if (result.success) {
      setOpen(false); // Закрываем окно при успехе
      toast.success(`Продукт "${name}" добавлен в справочник`);
    } else if (result.errors) {
      toast.error('Пожалуйста, проверьте правильность заполнения');
      setErrors(result.errors);
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> Добавить продукт
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Новый продукт в справочнике</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Название продукта</Label>
            <Input
              id='name'
              name='name'
              placeholder='Например: Куриное филе'
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className='text-xs text-destructive'>{errors.name[0]}</p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label>Категория</Label>
            <Select
              name='category'
              onValueChange={setCategory}
              defaultValue={category}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='FIRST'>Первое</SelectItem>
                <SelectItem value='SECOND'>Второе</SelectItem>
                <SelectItem value='DESSERT'>Десерт</SelectItem>
                <SelectItem value='DRINK'>Напиток</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='calories'>Калорийность (на 100г)</Label>
            <Input
              id='calories'
              name='calories'
              type='number'
              placeholder='0'
              className={errors.calories ? 'border-destructive' : ''}
            />
            {errors.calories && (
              <p className='text-xs text-destructive'>{errors.calories[0]}</p>
            )}
          </div>

          <DialogFooter className='mt-4'>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить продукт'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
