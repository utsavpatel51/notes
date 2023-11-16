'use client';
import Image from 'next/image';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { useRouter } from 'next/navigation';

const Documents = () => {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);

  const handleAddNote = async () => {
    const promise = create({
      title: 'Untitled Note',
    });

    toast.promise(promise, {
      loading: 'Creating note for you...',
      success: (documentId) => {
        router.push(`/documents/${documentId}`);
        return 'A note has been added.';
      },
      error: (err) => {
        return err instanceof ConvexError ? err.data : 'There is some issue while creating note!';
      },
    });
  };

  return (
    <div className='flex h-full flex-col items-center justify-center space-y-4'>
      <Image src={'/empty.svg'} alt={'Empty'} height={300} width={300} className='dark:hidden' />
      <Image
        src={'/empty-dark.svg'}
        alt={'Empty'}
        height={300}
        width={300}
        className='hidden dark:block'
      />
      <h2 className='text-lg font-medium'>
        Welcome to {user?.firstName || user?.username}&apos;s Notes
      </h2>
      <Button onClick={handleAddNote}>
        <PlusIcon className='mr-2 h-4 w-4' />
        Create a New Note
      </Button>
    </div>
  );
};
export default Documents;
