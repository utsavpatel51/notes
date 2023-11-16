import { SearchIcon, TrashIcon, UndoIcon } from 'lucide-react';
import React from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/spinner';
import ConfirmModal from '@/components/confirm-modal';

const TrashBox = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const archivedDocuments = useQuery(api.documents.getArchiveDocuments);
  const restoreDocuments = useMutation(api.documents.restoreArchiveDocuments);
  const deleteDocuments = useMutation(api.documents.deleteDocuments);
  const params = useParams();
  const router = useRouter();

  const handleRestoreDocument = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<'documents'>,
  ) => {
    e.stopPropagation();
    const promise = restoreDocuments({
      id: documentId,
    });

    toast.promise(promise, {
      loading: 'Restoring note for you...',
      success: 'A note has been restored.',
      error: (err) => {
        return err instanceof ConvexError ? err.data : 'There is some issue while restoring note!';
      },
    });
  };

  const handleDeleteDocument = async (documentId: Id<'documents'>) => {
    const promise = deleteDocuments({
      id: documentId,
    });

    toast.promise(promise, {
      loading: 'Deleting note for you...',
      success: 'A note has been deleted.',
      error: (err) => {
        return err instanceof ConvexError ? err.data : 'There is some issue while deleting note!';
      },
    });

    if (params.documentId === documentId) router.push('/documents');
  };

  const handleRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (archivedDocuments === undefined) {
    return (
      <div className='flex items-center justify-center p-4'>
        <Spinner size='lg' />
      </div>
    );
  }

  const filterDocuments = archivedDocuments?.filter((document) =>
    document.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='text-sm'>
      <div className='flex items-center gap-x-1'>
        <SearchIcon className='h4 w-4 text-muted-foreground' />
        <Input
          placeholder='Filter by page title...'
          className='h-7 w-full bg-secondary px-2 focus-visible:ring-transparent'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className='mt-2 px-1 pb-1'>
        <p className='hidden pb-2 text-center text-xs text-muted-foreground last:block'>
          No documents found
        </p>
        {filterDocuments?.map((document) => (
          <div
            key={document._id}
            role='button'
            onClick={() => handleRedirect(document._id)}
            className='flex w-full items-center justify-between rounded-sm text-sm hover:bg-primary/5'
          >
            <span>{document.title}</span>
            <div className='flex items-center gap-x-2'>
              <div
                role='button'
                className='rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                onClick={(e) => handleRestoreDocument(e, document._id)}
              >
                <UndoIcon className='h-4 w-4 text-muted-foreground' />
              </div>
              <ConfirmModal onConfirm={() => handleDeleteDocument(document._id)}>
                <div
                  role='button'
                  className='rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                >
                  <TrashIcon className='h-4 w-4 text-muted-foreground' />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;
