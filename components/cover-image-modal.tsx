import useCoverImageStore from '@/store/useCoverImage';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { SingleImageDropzone } from './single-image-dropzon';
import React from 'react';
import { useEdgeStore } from '@/lib/edgestore';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';

const CoverImageModal = () => {
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const params = useParams();
  const { edgestore } = useEdgeStore();
  const coverImageStore = useCoverImageStore();
  const updateDocument = useMutation(api.documents.updateDocument);

  const handleClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImageStore.onClose();
  };

  const handleFileChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      const response = await edgestore.publicFiles.upload({
        file,
        options: { replaceTargetUrl: coverImageStore.url },
      });

      await updateDocument({
        id: params.documentId as Id<'documents'>,
        coverImage: response.url,
      });

      handleClose();
    }
  };

  return (
    <Dialog open={coverImageStore.isOpen} onOpenChange={coverImageStore.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className='text-center text-lg font-semibold'>Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          disabled={isSubmitting}
          onChange={handleFileChange}
          value={file}
          className='w-full outline-none'
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
