'use client';
import React from 'react';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import useOrigin from '@/hooks/useOrigin';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CheckIcon, Copy, Dot, GlobeIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  initial: Doc<'documents'>;
}
const Publish = ({ initial }: Props) => {
  const origin = useOrigin();
  const updateDocument = useMutation(api.documents.updateDocument);

  const [copied, setCopied] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const publishUrl = `${origin}/preview/${initial._id}`;

  const handlePublishDocument = async (IsPublishing: boolean) => {
    setIsSubmitting(true);

    const promise = updateDocument({
      id: initial._id,
      isPublished: IsPublishing,
    });

    toast.promise(promise, {
      loading: IsPublishing ? 'Publishing...' : 'UnPublishing...',
      success: IsPublishing ? 'Published!' : 'UnPublished!',
      error: IsPublishing ? 'Failed to Publish' : 'Failed to UnPublish',
      finally: () => setIsSubmitting(false),
    });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publishUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const handleVisitUrl = () => {
    window.open(publishUrl, '_blank');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='sm' variant='ghost'>
          Publish
          {initial.isPublished && <GlobeIcon className='ml-2 h-4 w-4 text-sky-500' />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-72' align='end' alignOffset={8}>
        {initial.isPublished ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-x-1'>
              <Dot className='h-8 w-8 animate-ping text-sky-600' />
              <p className='text-sm font-medium text-sky-600'>This page is live on the web.</p>
            </div>
            <div className='flex items-center'>
              <Input
                disabled
                value={publishUrl}
                className='h-8 flex-1 truncate rounded-l-md border bg-muted px-2 text-xs'
              />
              <Button
                size='sm'
                onClick={handleCopyUrl}
                disabled={copied}
                className='h-8 rounded-l-none'
              >
                {copied ? (
                  <CheckIcon className='h-4 w-4 text-muted-foreground' />
                ) : (
                  <Copy className='h-4 w-4 text-muted-foreground' />
                )}
              </Button>
            </div>
            <div className='flex items-center justify-between'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => handlePublishDocument(false)}
                disabled={isSubmitting}
              >
                Unpublish
              </Button>
              <Button size='sm' className='bg-sky-600 text-white' onClick={handleVisitUrl}>
                Visit site
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <GlobeIcon className='h-8 w-8 text-muted-foreground' />
            <p className='mb-2 text-sm font-medium'>Publish this note</p>
            <span className='mb-4 text-xs text-muted-foreground'>
              Share your notes with the world
            </span>
            <Button
              onClick={() => handlePublishDocument(true)}
              size='sm'
              disabled={isSubmitting}
              className='w-full text-xs'
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Publish;
