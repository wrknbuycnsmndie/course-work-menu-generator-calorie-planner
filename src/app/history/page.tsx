import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { HistoryTable } from '@/components/history/HistoryTable';

export default async function HistoryPage() {
  const logs = await prisma.dailyLog.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });

  return (
    <div className='container mx-auto p-4 md:p-6 space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl'>
          История питания
        </h1>
        <p className='text-sm text-muted-foreground md:text-base'>
          Просматривайте свои достижения и анализируйте рацион за прошлые дни.
        </p>
      </div>

      <Card className='border-none shadow-none'>
        <CardContent className='p-0 sm:p-6'>
          <HistoryTable logs={logs} />
        </CardContent>
      </Card>
    </div>
  );
}
