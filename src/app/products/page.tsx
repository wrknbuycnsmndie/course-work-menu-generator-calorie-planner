import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { ProductTable } from '@/components/products/ProductsTable';
import { AddProductDialog } from '@/components/products/AddProductDialog';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    // Увеличиваем p-2 до p-4 на десктопах для "воздуха"
    <div className='container mx-auto p-4 md:p-6 space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl'>
            Справочник продуктов
          </h1>
          <p className='text-sm text-muted-foreground md:text-base'>
            Управляйте базой продуктов для точного расчета калорий.
          </p>
        </div>

        <div className='w-full sm:w-auto'>
          <AddProductDialog />
        </div>
      </div>

      <Card className='border-none shadow-none'>
        <CardContent className='p-0 sm:p-6'>
          <ProductTable products={products} />
        </CardContent>
      </Card>
    </div>
  );
}
