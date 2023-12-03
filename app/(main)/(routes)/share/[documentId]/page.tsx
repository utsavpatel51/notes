'use client';
import React from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import DocumentToolBar from '@/components/document-tool-bar';
import DocumentCoverBar from '@/components/document-cover-bar';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const DocumentSharePage = ({ params }: { params: { documentId: Id<'documents'> } }) => {
  // https://www.blocknotejs.org/docs/nextjs#import-as-dynamic
  const DocumentEditor = React.useMemo(
    () =>
      dynamic(() => import('@/app/(main)/_components/document/document-editor'), { ssr: false }),
    [],
  );

  const sharedDocument = useQuery(api.sharedDocuments.getShareDocumentById, {
    id: params.documentId,
  });

  const updateDocument = useMutation(api.documents.updateDocument);

  const handleContentChange = (value: string) => {
    updateDocument({
      id: params.documentId,
      content: value,
    });
  };

  if (sharedDocument === undefined) {
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

  if (sharedDocument === null || sharedDocument.document === null) {
    return null;
  }

  return (
    <div className='pb-40'>
      <DocumentCoverBar
        url={sharedDocument.document?.coverImage}
        preview={sharedDocument.accessLevel === 'read'}
      />
      <div className='mx-auto md:max-w-3xl lg:max-w-4xl'>
        <DocumentToolBar initial={sharedDocument.document} preview={!!sharedDocument.accessLevel} />
        <DocumentEditor
          initialContent={sharedDocument.document.content}
          onChange={handleContentChange}
          editable={sharedDocument.accessLevel === 'write'}
        />
      </div>
    </div>
  );
};

export default DocumentSharePage;
