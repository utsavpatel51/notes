import { Id } from '@/convex/_generated/dataModel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';

interface Props {
  documentId: Id<'documents'>;
}
const PageMenu = ({ documentId }: Props) => {
  const archiveDocument = useMutation(api.documents.archiveDocument);
  const { user } = useUser();
  const router = useRouter();

  const handleArchiveDocument = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const promise = archiveDocument({
      id: documentId,
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

    router.push('/documents');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
        <div
          role='button'
          className='h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
        >
          <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-60'
        align='end'
        alignOffset={8}
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
  );
};
export default PageMenu;
