'use client';
import React from 'react';
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';

interface Props {
  onClick?: () => void;
  label: string;
  icon: LucideIcon;
  id?: Id<'documents'>;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  onExpand?: () => void;
  isSearch?: boolean;
  level?: number;
}
const Item = ({ icon: Icon, level = 0, ...props }: Props) => {
  const router = useRouter();
  const archiveDocument = useMutation(api.documents.archiveDocument);
  const createDocument = useMutation(api.documents.create);
  const { user } = useUser();

  const ExpandIcon = props.expanded ? ChevronDown : ChevronRight;

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    props.onExpand?.();
  };

  const handleAddNote = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!props.id) return;
    e.stopPropagation();

    const promise = createDocument({
      title: 'Untitled Note',
      parentDocument: props.id,
    });

    toast.promise(promise, {
      loading: 'Creating note for you...',
      success: (documentId) => {
        if (!props.expanded) {
          props.onExpand?.();
        }
        router.push(`/documents/${documentId}`);
        return 'A note has been added.';
      },
      error: (err) => {
        return err instanceof ConvexError ? err.data : 'There is some issue while creating note!';
      },
    });
  };

  const handleArchiveDocument = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!props.id) return;
    const promise = archiveDocument({
      id: props.id,
    });

    toast.promise(promise, {
      loading: 'Moving note to archive...',
      success: 'Moved note to archive.',
      error: (err) => {
        return err instanceof ConvexError
          ? err.data
          : 'There is some issue while moving note to archive!';
      },
    });
  };

  return (
    <div
      onClick={props.onClick}
      role='button'
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      className={cn(
        'group flex min-h-[27px] w-full items-center py-1 pr-1 text-sm font-medium text-muted-foreground hover:bg-primary/5',
        props.active && 'bg-primary/5 text-primary',
      )}
    >
      {!!props.id && (
        <div
          className='mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
          role='button'
          onClick={handleExpand}
        >
          <ExpandIcon className='h-4 w-4 shrink-0 text-muted-foreground/50' />
        </div>
      )}
      {/* Document Icon */}
      {props.documentIcon ? (
        <div className='mr-2 shrink-0 text-[18px]'>{props.documentIcon}</div>
      ) : (
        <Icon className='mr-2 h-4 w-4 shrink-0 text-muted-foreground' />
      )}
      <span className='truncate'>{props.label}</span>
      {props.isSearch && (
        <kbd className='pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
          <span className='text-sm'>⌘</span>K
        </kbd>
      )}
      {!!props.id && (
        <div className='ml-auto flex items-center gap-x-2 pr-1'>
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role='button'
                className='h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600'
              >
                <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-60'
              align='start'
              side='right'
              forceMount
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem onClick={handleArchiveDocument}>
                <Trash className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <span className='p-2 text-xs text-muted-foreground'>
                Last edited by: {user?.firstName || user?.username}
              </span>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role='button'
            onClick={handleAddNote}
            className='h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600'
          >
            <Plus className='h-4 w-4 text-muted-foreground' />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level = 0 }: { level?: number }) {
  return (
    <div style={{ paddingLeft: `${level * 12 + 12}px` }} className='flex gap-x-2 py-[3px]'>
      <Skeleton className='h-4 w-4' />
      <Skeleton className='h-4 w-[80%]' />
    </div>
  );
};
export default Item;
