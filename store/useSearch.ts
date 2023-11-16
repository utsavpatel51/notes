import { create } from 'zustand';

interface SearchStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

const useSearchStore = create<SearchStore>()((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onToggle: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),
}));

export default useSearchStore;
