'use client';
import React from 'react';
import useSearchStore from '@/store/useSearch';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import { FileIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SearchCommand = () => {
  const documents = useQuery(api.documents.getSearchDocuments);
  const { user } = useUser();
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  const isSearchOpen = useSearchStore().isOpen;
  const onSearchToggle = useSearchStore().onToggle;
  const onSearchClose = useSearchStore().onClose;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onSearchToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSearchToggle]);

  const handleSelectItem = (id: string) => {
    router.push(`/documents/${id}`);
    onSearchClose();
  };

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isSearchOpen} onOpenChange={onSearchClose}>
      <CommandInput placeholder={`Search ${user?.firstName || user?.username}'s Notes...`} />
      <CommandList>
        <CommandEmpty>No result.</CommandEmpty>
        <CommandGroup heading='Docuemnts'>
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={() => handleSelectItem(document._id)}
            >
              {document.icon ? (
                <p className='mr-2'>{document.icon}</p>
              ) : (
                <FileIcon className='mr-2 h-4 w-4' />
              )}
              {document.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
