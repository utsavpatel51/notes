'use client';
import React from 'react';
import SettingModal from '@/components/setting-modal';
import CoverImageModal from '@/components/cover-image-modal';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingModal />
      <CoverImageModal />
    </>
  );
};

export default ModalProvider;
