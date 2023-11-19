import { Doc } from '@/convex/_generated/dataModel';
import EmojiPicker from '@/components/modals/emoji-picker';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { ImageIcon, SmileIcon, XIcon } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import React from 'react';
import useCoverImageStore from '@/store/useCoverImage';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Props {
  initial: Doc<'documents'>;
  preview?: boolean;
}

const DocumentToolBar = ({ initial, preview }: Props) => {
  const { onOpen } = useCoverImageStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [isEditing, setIsEditing] = React.useState(true);
  const [value, setValue] = React.useState(initial.title);

  const update = useMutation(api.documents.updateDocument);

  const handleDocumentUpdate = (key: keyof Doc<'documents'>, value: string) => {
    update({
      id: initial._id,
      [key]: value,
    });
  };

  const handleAllowEdit = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initial.title);
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current?.value.length);
    }, 0);
  };

  const handleDisableEdit = () => {
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleDisableEdit();
    }
  };
  return (
    <div className='group relative pl-[54px]'>
      {/* If it has Icon and not in preview mode */}
      {!!initial.icon && !preview && (
        <div className='gap-x-2/icon group/icon flex items-center pt-6'>
          <EmojiPicker onChange={(icon) => handleDocumentUpdate('icon', icon)}>
            <p className='text-6xl transition hover:opacity-75'>{initial.icon}</p>
          </EmojiPicker>
          <Button
            onClick={() => handleDocumentUpdate('icon', '')}
            variant='ghost'
            size='icon'
            className={cn(
              'rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100',
              isMobile && 'opacity-100',
            )}
          >
            <XIcon className='h-4 w-4' />
          </Button>
        </div>
      )}
      {/* If it has icon but in preview mode */}
      {!!initial.icon && preview && <p className='pt-6 text-6xl'>{initial.icon}</p>}

      <div className='flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100'>
        {!initial.icon && !preview && (
          <EmojiPicker onChange={(icon) => handleDocumentUpdate('icon', icon)} asChild>
            <Button className='text-xs text-muted-foreground' variant='ghost' size='sm'>
              <SmileIcon className='mr-2 h-4 w-4' />
              Add Icon
            </Button>
          </EmojiPicker>
        )}

        {!initial.coverImage && !preview && (
          <Button
            className='text-xs text-muted-foreground'
            variant='ghost'
            size='sm'
            onClick={() => onOpen()}
          >
            <ImageIcon className='mr-2 h-4 w-4' />
            Add Cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleDocumentUpdate('title', e.target.value || 'Untitled Note');
          }}
          onBlur={handleDisableEdit}
          onKeyDown={handleTitleKeyDown}
          className='w-full resize-none break-words border-none bg-transparent text-5xl font-bold text-[#3F3F3F] outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-[#CFCFCF]'
          ref={inputRef}
        />
      ) : (
        <div
          onClick={handleAllowEdit}
          className='break-words pb-[11.5px] text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]'
        >
          {initial.title}
        </div>
      )}
    </div>
  );
};

export default DocumentToolBar;
