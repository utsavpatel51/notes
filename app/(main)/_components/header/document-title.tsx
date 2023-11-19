import React from 'react';
import { Doc } from '@/convex/_generated/dataModel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import DocumentItem from '@/app/(main)/_components/sidebar/document-item';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  initial: Doc<'documents'>;
}

const DocumentTitle = ({ initial }: Props) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const updateDocument = useMutation(api.documents.updateDocument);

  const [title, setTitle] = React.useState(initial.title || 'Untitled Note');
  const [isEditing, setIsEditing] = React.useState(false);

  const handleAllowEdit = () => {
    setTitle(initial.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current?.value.length);
    }, 0);
  };

  const handleDisableEdit = () => {
    setIsEditing(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateDocument({
      id: initial._id,
      title: e.target.value || 'Untitled Note',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleDisableEdit();
    }
  };

  return (
    <div className='flex items-center gap-x-1'>
      {!!initial.icon && <p>{initial.icon}</p>}
      {isEditing ? (
        <Input
          className='h-7 px-2 focus-visible:ring-transparent'
          ref={inputRef}
          value={title}
          onChange={handleTitleChange}
          onBlur={handleDisableEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <Button
          variant='ghost'
          size='sm'
          className='h-auto p-1 font-normal'
          onClick={handleAllowEdit}
        >
          {initial.title}
        </Button>
      )}
    </div>
  );
};

DocumentTitle.Skeleton = function TitleSkeleton() {
  return (
    <div className='px-3 py-2'>
      <Skeleton className='h-4 w-16 rounded-md px-3 py-2' />
    </div>
  );
};

export default DocumentTitle;
