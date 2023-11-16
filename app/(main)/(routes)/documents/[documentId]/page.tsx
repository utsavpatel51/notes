'use client';
import React from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Toolbar from '@/components/toolbar';
import CoverBar from '@/components/cover-bar';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const DocumentPage = ({ params }: { params: { documentId: Id<'documents'> } }) => {
  // https://www.blocknotejs.org/docs/nextjs#import-as-dynamic
  const Editor = React.useMemo(
    () => dynamic(() => import('@/app/(main)/_components/editor'), { ssr: false }),
    [],
  );

  const document = useQuery(api.documents.getDocumentById, {
    id: params.documentId,
  });

  const updateDocument = useMutation(api.documents.updateDocument);

  const handleContentChange = (value: string) => {
    updateDocument({
      id: params.documentId,
      content: value,
    });
  };

  if (document === undefined) {
    return (
      <div className='w-full pt-8'>
        <Skeleton className='h-[12vh] w-full' />
        <div className='mx-auto mt-10 md:max-w-3xl lg:max-w-4xl'>
          <div className='space-y-4 pl-8 pt-4'>
            <Skeleton className='h-14 w-[50%]' />
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-4 w-[60%]' />
            <Skeleton className='h-4 w-[40%]' />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return null;
  }

  return (
    <div className='pb-40'>
      <CoverBar url={document.coverImage} />
      <div className='mx-auto md:max-w-3xl lg:max-w-4xl'>
        <Toolbar initial={document} />
        <Editor initialContent={document.content} onChange={handleContentChange} />
      </div>
    </div>
  );
};

export default DocumentPage;
