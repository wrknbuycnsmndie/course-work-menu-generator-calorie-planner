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
import { deleteProductAction } from '@/app/actions';
import { useState } from 'react';
import type { Category, Product } from '@prisma/client';
import { DeleteProductConfirm } from './DeleteProductConfirm';
import { EditProductForm } from './EditProductForm';
import { Badge } from '../ui/badge';

interface Props {
  products: Product[];
}

export function ProductTable({ products }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const categoryLabels: Record<Category, string> = {
    FIRST: 'Первое',
    SECOND: 'Второе',
    DESSERT: 'Десерт',
    DRINK: 'Напиток',
  };

  async function handleDelete(id: number) {
    if (
      !confirm(
        'Вы уверены, что хотите удалить этот продукт? Это также удалит его из всех записей рациона.'
      )
    )
      return;

    setDeletingId(id);
    await deleteProductAction(id);
    setDeletingId(null);
  }

  return (
    <Card className='w-full'>
      <CardContent className='p-0'>
        {/* Контейнер для горизонтальной прокрутки на мобилках */}
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50%]'>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead className='text-right'>Ккал / 100г</TableHead>
                <TableHead className='text-right'>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className='h-24 text-center text-muted-foreground'
                  >
                    Справочник пуст. Добавьте первый продукт.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className='font-medium'>
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {categoryLabels[product.category]}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      {product.calories}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <EditProductForm product={product} />

                        <DeleteProductConfirm
                          productId={product.id}
                          productName={product.name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
