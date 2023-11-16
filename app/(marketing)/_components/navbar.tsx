'use client';
import useScrollTop from '@/hooks/useScrollTop';
import { cn } from '@/lib/utils';
import Logo from '@/app/(marketing)/_components/logo';
import ModeToggle from '@/components/theme-toggle';
import Spinner from '@/components/spinner';
import { useConvexAuth } from 'convex/react';
import { SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const isScrolled = useScrollTop();
  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-50 flex w-full items-center bg-background p-6 dark:bg-[#1f1f1f]',
        isScrolled && 'border-b shadow-sm',
      )}
    >
      <Logo showInMobile />

      <div className='flex w-full items-center justify-end gap-x-2 md:ml-auto'>
        {isLoading && <Spinner />}
        {!isLoading && !isAuthenticated && (
          <SignInButton mode='modal' afterSignInUrl={'/documents'}>
            <Button size='sm'>Log In</Button>
          </SignInButton>
        )}
        {!isLoading && isAuthenticated && (
          <>
            <Button variant='ghost' size='sm' asChild>
              <Link href={'/documents'}>Enter Notes</Link>
            </Button>
            <UserButton afterSignOutUrl='/' />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};
export default Navbar;
