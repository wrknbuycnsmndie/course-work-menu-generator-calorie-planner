'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, Loader2 } from 'lucide-react';
import * as z from 'zod';

import { ProductSchema } from '@/lib/schemas';
import { updateProductAction } from '@/app/actions';
import type { Category, Product } from '@prisma/client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

interface Props {
  product: Product;
}

// Ключевое исправление: используем z.input для типов формы
type ProductFormValues = z.input<typeof ProductSchema>;

export function EditProductForm({ product }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product.name,
      calories: product.calories,
      category: product.category as Category,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    setIsLoading(true);

    const result = await updateProductAction(
      product.id,
      values as z.infer<typeof ProductSchema>
    );

    if (result.success) {
      setOpen(false);
      toast.success(`Продукт "${values.name}" успешно обновлен`);
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([key, messages]) => {
        form.setError(key as keyof ProductFormValues, {
          message: messages?.[0],
        });
      });
      toast.error('Ошибка валидации данных');
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 text-muted-foreground hover:text-primary'
        >
          <Edit2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Редактировать продукт</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Выберите категорию' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='FIRST'>Первое</SelectItem>
                      <SelectItem value='SECOND'>Второе</SelectItem>
                      <SelectItem value='DESSERT'>Десерт</SelectItem>
                      <SelectItem value='DRINK'>Напиток</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='calories'
              render={({ field }) => {
                const value =
                  typeof field.value === 'number' ||
                  typeof field.value === 'string'
                    ? field.value
                    : '';

                return (
                  <FormItem>
                    <FormLabel>Ккал на 100г</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        name={field.name}
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                        ref={field.ref}
                        value={value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className='flex justify-end pt-4'>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Сохранить изменения
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
