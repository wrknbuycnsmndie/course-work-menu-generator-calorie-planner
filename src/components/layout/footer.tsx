export function Footer() {
  return (
    <footer className='w-full border-t py-6 md:py-0'>
      <div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
        <p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
          Вариант 5: Составление меню по заданным калориям.
        </p>
        <div className='flex items-center gap-4 text-sm font-medium text-muted-foreground'>
          <span>2026</span>
          <span className='h-4 w-[1px] bg-border'></span>
          <span>Next.js + Prisma + SQLite</span>
        </div>
      </div>
    </footer>
  );
}
