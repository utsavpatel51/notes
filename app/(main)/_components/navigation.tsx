import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  SearchIcon,
  SettingsIcon,
  Trash,
} from 'lucide-react';
import React, { ElementRef } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { useParams, usePathname } from 'next/navigation';
import UserItem from '@/app/(main)/_components/user-item';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Item from '@/app/(main)/_components/item';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import DocumentList from '@/app/(main)/_components/document-list';
import TrashBox from '@/app/(main)/_components/trash-box';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useSearchStore from '@/store/useSearch';
import useSettingStore from '@/store/useSetting';
import Navbar from '@/app/(main)/_components/navbar';
import { useRouter } from 'next/navigation';

const Navigation = () => {
  const pathName = usePathname();
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const onSearchOpen = useSearchStore().onOpen;
  const onSettingOpen = useSettingStore().onOpen;

  const createDocument = useMutation(api.documents.create);

  const handleAddNote = async () => {
    const promise = createDocument({
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

  const isResizingRef = React.useRef(false);
  const sideBarRef = React.useRef<ElementRef<'aside'>>(null);
  const navBarRef = React.useRef<ElementRef<'div'>>(null);

  const [isResetting, setIsResetting] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(isMobile);

  React.useEffect(() => {
    if (isMobile) collapse();
    else resetWidth();
  }, [isMobile]);

  React.useEffect(() => {
    if (isMobile) collapse();
  }, [isMobile, pathName]);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = e.clientX;
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sideBarRef.current && navBarRef.current) {
      sideBarRef.current.style.width = `${newWidth}px`;
      navBarRef.current.style.setProperty('left', `${newWidth}px`);
      navBarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    isResizingRef.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const resetWidth = () => {
    if (sideBarRef.current && navBarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sideBarRef.current.style.width = isMobile ? '100%' : '240px';
      navBarRef.current.style.setProperty('width', isMobile ? '0' : 'calc(100% - 240px)');
      navBarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sideBarRef.current && navBarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sideBarRef.current.style.width = '0';
      navBarRef.current.style.setProperty('width', '100%');
      navBarRef.current.style.setProperty('left', '0');

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      <aside
        ref={sideBarRef}
        className={cn(
          'group/sidebar relative z-[99999] flex h-full w-60 flex-col overflow-y-auto bg-secondary',
          isMobile && 'w-0',
          isResetting && 'transition-all duration-300 ease-in-out',
        )}
      >
        <div
          role='button'
          className={cn(
            'absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600',
            isMobile && 'opacity-100',
          )}
        >
          <ChevronsLeft className='h-6 w-6' onClick={collapse} />
        </div>

        <UserItem />
        <Item onClick={onSearchOpen} label='Search' icon={SearchIcon} isSearch />
        <Item onClick={onSettingOpen} label='Settings' icon={SettingsIcon} />
        <Item onClick={handleAddNote} label='New Note' icon={PlusCircle} />

        <div className='mt-4 overflow-y-auto'>
          <DocumentList />
          <Item onClick={handleAddNote} label='Add Note' icon={Plus} />
          <Popover>
            <PopoverTrigger className='mt-4 w-full'>
              <Item label={'Trash'} icon={Trash} />
            </PopoverTrigger>
            <PopoverContent side={isMobile ? 'bottom' : 'right'} className='p-2'>
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className='absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100'
        />
      </aside>
      <div
        ref={navBarRef}
        className={cn(
          'w-[calc(100% - 240px)] absolute left-60 top-0 z-[99999]',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'left-0 w-full',
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} resetWidth={resetWidth} />
        ) : (
          <nav className='w-full bg-transparent px-3 py-2'>
            {isCollapsed && (
              <MenuIcon
                className='h-6 w-6 text-muted-foreground'
                role='button'
                onClick={resetWidth}
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;
