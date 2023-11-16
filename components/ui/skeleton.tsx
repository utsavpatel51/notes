import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral-300/50 dark:bg-neutral-600/30', className)}
      {...props}
    />
  );
}

export { Skeleton };
