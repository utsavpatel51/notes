'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from './ui/button';
import { ImageIcon, XIcon } from 'lucide-react';
import useCoverImageStore from '@/store/useCoverImage';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useEdgeStore } from '@/lib/edgestore';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Props {
  url?: string;
  preview?: boolean;
}

const DocumentCoverBar = ({ url, preview }: Props) => {
  const params = useParams();
  const { onOpen } = useCoverImageStore();
  const updateDocument = useMutation(api.documents.updateDocument);
  const { edgestore } = useEdgeStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleRemoveCover = async () => {
    await updateDocument({
      id: params.documentId as Id<'documents'>,
      coverImage: '',
    });

    await edgestore.publicFiles.delete({
      url: url as string,
    });
  };

  return (
    <div className={cn('w-ful group relative h-[35vh]', !url && 'h-[12vh]', url && 'bg-muted')}>
      {!!url && <Image src={url} alt='Cover Image' className='object-cover' fill />}
      {url && !preview && (
        <div
          className={cn(
            'absolute bottom-5 right-5 flex items-center justify-center gap-x-2 opacity-0 group-hover:opacity-100',
            isMobile && 'opacity-100',
          )}
        >
          <Button
            variant='outline'
            onClick={() => onOpen(url)}
            size='sm'
            className='text-xs text-muted-foreground'
          >
            <ImageIcon className='mr-2 h-4 w-4' />
            Change Cover
          </Button>
          <Button
            variant='outline'
            onClick={handleRemoveCover}
            size='sm'
            className='text-xs text-muted-foreground'
          >
            <XIcon className='mr-2 h-4 w-4' />
            Remove Cover
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentCoverBar;
