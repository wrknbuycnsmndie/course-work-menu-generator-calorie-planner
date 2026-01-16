'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProductAction } from '@/app/actions';
import { toast } from 'sonner';

interface Props {
  productId: number;
  productName: string;
}

export function DeleteProductConfirm({ productId, productName }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      const result = await deleteProductAction(productId);

      if (result.success) {
        toast.success(`Продукт «${productName}» удален`);
        setOpen(false);
      } else {
        toast.error('Не удалось удалить продукт');
      }
    } catch (error) {
      toast.error('Произошла ошибка при удалении');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 text-muted-foreground hover:text-destructive'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы собираетесь удалить продукт{' '}
            <span className='font-semibold text-foreground'>
              «{productName}»
            </span>
            . Это действие нельзя отменить. Продукт также исчезнет из всех логов
            питания.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Предотвращаем закрытие до окончания экшна
              handleDelete();
            }}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Удаление...
              </>
            ) : (
              'Удалить'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
