import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import DocumentItem from './document-item';
import { FileIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SharedDocumentList = () => {
  const router = useRouter();
  const shareDocuments = useQuery(api.sharedDocuments.getShareDocuments);

  if (shareDocuments === undefined) {
    return <DocumentItem.Skeleton />;
  }

  if (shareDocuments.length === 0) {
    return null;
  }
  const handleRouter = (documentId: string | undefined) => {
    if (!documentId) return;
    router.push(`/share/${documentId}`);
  };

  return (
    <>
      <p className='pl-[15px] text-xs font-medium text-muted-foreground/80'>Shared</p>
      {shareDocuments?.map((document) => (
        <div key={document.id}>
          <DocumentItem
            id={document.id}
            onClick={() => handleRouter(document.id)}
            label={document?.title || ''}
            icon={FileIcon}
            documentIcon={document.icon}
            expanded={false}
          />
        </div>
      ))}
    </>
  );
};

export default SharedDocumentList;
