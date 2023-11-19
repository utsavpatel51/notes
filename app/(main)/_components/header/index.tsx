import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { MenuIcon } from 'lucide-react';
import DocumentTitle from '@/app/(main)/_components/header/document-title';
import TrashBanner from '@/app/(main)/_components/document/trash-banner';
import DocumentAction from '@/app/(main)/_components/header/document-action';
import PublishSection from './publish-section';

interface Props {
  isCollapsed: boolean;
  resetWidth: () => void;
}
const Header: React.FC<Props> = ({ isCollapsed, resetWidth }) => {
  const params = useParams();
  const document = useQuery(api.documents.getDocumentById, {
    id: params.documentId as Id<'documents'>,
  });

  if (document === undefined) {
    return <DocumentTitle.Skeleton />;
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
          <DocumentTitle initial={document} />
          <div className='flex items-center gap-x-2'>
            <PublishSection initial={document} />
            <DocumentAction documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <TrashBanner documentId={document._id} />}
    </>
  );
};

export default Header;
