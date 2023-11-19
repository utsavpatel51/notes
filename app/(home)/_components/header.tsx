'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useConvexAuth } from 'convex/react';
import Spinner from '@/components/spinner';
import { SignInButton } from '@clerk/clerk-react';
import Link from 'next/link';

const Header = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl font-bold sm:text-6xl md:text-6xl'>
        Your Ideas, Documents, & Plans. Unified. Welcome to <span className='underline'>Notes</span>
        .
      </h1>
      <h3 className='text-base font-medium sm:text-xl md:text-2xl'>
        The connected workspace where
        <br />
        better, faster works happens.
      </h3>
      {isLoading && (
        <div className='flex w-full items-center justify-center'>
          <Spinner size='lg' />
        </div>
      )}
      {!isLoading && !isAuthenticated && (
        <SignInButton mode='modal'>
          <Button>
            Get Notes Free
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </SignInButton>
      )}
      {!isLoading && isAuthenticated && (
        <Button asChild>
          <Link href={'/documents'}>
            Enter Notes <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default Header;
