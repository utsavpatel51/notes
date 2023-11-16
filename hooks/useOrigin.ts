import React from 'react';

const useOrigin = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const origin =
    typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  if (!isMounted) return null;
  return origin;
};

export default useOrigin;
