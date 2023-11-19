import React from 'react';
import Navbar from '@/app/(home)/_components/navbar';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full'>
      <Navbar />
      <main className='min-h-full bg-background pt-40 dark:bg-[#1f1f1f]'>{children}</main>
    </div>
  );
}
