import { DailyDiet } from '@/components/planner/DailyDiet';
import { ProductSelector } from '@/components/planner/ProductSelector';
import { ProgressCard } from '@/components/planner/ProgressCard';
import { getPlannerData } from '@/app/actions';
import { SmartGenerator } from '@/components/SmartGenerator';

export default async function HomePage() {
  const { products, dailyLog } = await getPlannerData();

  return (
    // p-2 для мобилок, p-4 md:p-6 для планшетов и десктопов
    <div className='container mx-auto p-2 md:p-6 space-y-6 md:space-y-8'>
      {/* Responsive Header */}
      <div className='space-y-1 md:space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl'>
          Планировщик рациона
        </h1>
        <p className='text-sm text-muted-foreground md:text-base lg:text-lg max-w-2xl'>
          Управляйте своим питанием и следите за калориями в реальном времени.
        </p>
      </div>

      {/* Умный генератор (обычно занимает всю ширину) */}
      <section>
        <SmartGenerator products={products} />
      </section>

      {/* Аналитика (ProgressCard) */}
      <section>
        <ProgressCard log={dailyLog} />
      </section>

      {/* Интерактив: Сетка 
          На мобилках: Selector сверху, Diet снизу (stack).
          На десктопе: Selector слева (7/12), Diet справа (5/12).
      */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6'>
        <div className='lg:col-span-7'>
          <ProductSelector products={products} />
        </div>

        <div className='lg:col-span-5'>
          {/* Передаем items из лога */}
          <DailyDiet items={dailyLog?.items ?? []} />
        </div>
      </div>
    </div>
  );
}
