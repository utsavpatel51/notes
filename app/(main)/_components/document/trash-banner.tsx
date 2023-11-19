import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import React from 'react';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/modals/confirm-modal';

interface Props {
  documentId: Id<'documents'>;
}
const TrashBanner = ({ documentId }: Props) => {
  const restoreDocuments = useMutation(api.documents.restoreArchiveDocuments);
  const deleteDocuments = useMutation(api.documents.deleteDocuments);
  const router = useRouter();

  const handleRestoreDocument = async () => {
    const promise = restoreDocuments({
      id: documentId,
    });

    toast.promise(promise, {
      loading: 'Restoring note for you...',
      success: () => 'A note has been restored.',
      error: (err) => {
        return err instanceof ConvexError ? err.data : 'There is some issue while restoring note!';
      },
    });
  };

  const handleDeleteDocument = async () => {
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

    router.push('/documents');
  };

  return (
    <div className='flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white'>
      <p>This page is in Trash.</p>
      <Button
        size='sm'
        variant='outline'
        onClick={handleRestoreDocument}
        className='h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5'
      >
        Restore Page
      </Button>

      <ConfirmModal onConfirm={handleDeleteDocument}>
        <Button
          size='sm'
          variant='outline'
          className='h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5'
        >
          Delete Forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
export default TrashBanner;
