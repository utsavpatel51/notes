import { Doc, Id } from '@/convex/_generated/dataModel';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import DocumentItem from '@/app/(main)/_components/sidebar/document-item';
import { FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  parentDocumentId?: Id<'documents'>;
  level?: number;
  data?: Doc<'documents'>;
}

const DocumentList: React.FC<Props> = ({ level = 0, ...props }) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const documents = useQuery(api.documents.getUserDocuments, {
    parentDocument: props.parentDocumentId,
  });

  const handleOnExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const handleRouter = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return <DocumentItem.Skeleton level={level} />;
  }

  return (
    <>
      <p
        className={cn(
          'hidden pl-[15px] text-xs font-medium text-muted-foreground/80',
          level === 0 && 'block',
        )}
      >
        Private
      </p>
      <p
        style={{
          paddingLeft: `${level * 12 + 25}px`,
        }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden',
        )}
      >
        No pages inside
      </p>
      {documents?.map((document) => (
        <div key={document._id}>
          <DocumentItem
            id={document._id}
            onClick={() => handleRouter(document._id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.docuemntId === document._id}
            level={level}
            onExpand={() => handleOnExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
