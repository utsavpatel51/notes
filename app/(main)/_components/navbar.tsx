import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { MenuIcon } from 'lucide-react';
import Title from '@/app/(main)/_components/title';
import Banner from '@/app/(main)/_components/banner';
import PageMenu from '@/app/(main)/_components/page-menu';
import Publish from './publish';

interface Props {
  isCollapsed: boolean;
  resetWidth: () => void;
}
const Navbar: React.FC<Props> = ({ isCollapsed, resetWidth }) => {
  const params = useParams();
  const document = useQuery(api.documents.getDocumentById, {
    id: params.documentId as Id<'documents'>,
  });

  if (document === undefined) {
    return <Title.Skeleton />;
  }

  if (document === null) {
    return null;
  }

  return (
    <>
      <nav className='flex items-center gap-x-4 bg-background px-3 py-2 dark:bg-[#1F1F1F]'>
        {isCollapsed && (
          <MenuIcon className='h-6 w-6 text-muted-foreground' role='button' onClick={resetWidth} />
        )}
        <div className='flex w-full items-center justify-between'>
          <Title initial={document} />
          <div className='flex items-center gap-x-2'>
            <Publish initial={document} />
            <PageMenu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};

export default Navbar;
