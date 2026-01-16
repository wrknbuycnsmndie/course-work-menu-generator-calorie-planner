'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet';

const navItems = [
  { href: '/', label: 'Планировщик' },
  { href: '/products', label: 'Продукты' },
  { href: '/history', label: 'История' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='sticky w-full z-20 top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur'>
      <div className='max-w-screen-xl mx-auto p-4 flex items-center justify-between'>
        <div className='flex-1' />

        <Link href='/' className='font-semibold text-lg'>
          Умное меню
        </Link>

        <div className='flex-1 flex justify-end'>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className='p-2 hover:bg-muted rounded-md'
                aria-label='Меню'
              >
                <Menu className='h-6 w-6' />
              </button>
            </SheetTrigger>

            <SheetContent side='right' className='w-[300px]'>
              <SheetHeader className='border-b pb-4'>
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>

              <div className='flex flex-col gap-2 p-2 mt-6'>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className='text-lg text-center border-2  font-medium p-3 rounded-md hover:bg-muted transition-colors'
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
