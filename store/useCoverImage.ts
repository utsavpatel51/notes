import { create } from 'zustand';

interface CoverImageStore {
  url?: string;
  isOpen: boolean;
  onOpen: (url?: string) => void;
  onClose: () => void;
}

const useCoverImageStore = create<CoverImageStore>()((set) => ({
  url: undefined,
  isOpen: false,
  onOpen: (url) => set({ isOpen: true, url }),
  onClose: () => set({ isOpen: false, url: undefined }),
}));

export default useCoverImageStore;
