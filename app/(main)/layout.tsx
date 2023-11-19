'use client';
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import { redirect } from 'next/navigation';
import Spinner from '@/components/spinner';
import SideBar from '@/app/(main)/_components/sidebar';
import SearchCommand from '@/components/modals/search-command';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading)
    return (
      <div className='flex h-full items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  if (!isAuthenticated) redirect('/');

  return (
    <div className='flex h-full dark:bg-[#1f1f1f]'>
      <SideBar />
      <main className='h-full flex-1 overflow-y-auto'>
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
