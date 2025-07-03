import { create } from 'zustand';
import { Borrower } from '../types';

interface Store {
  activeBorrower: Borrower | null;
  activeTab: string;
  setActiveBorrower: (borrower: Borrower | null) => void;
  setActiveTab: (tab: string) => void;
}

export const useStore = create<Store>((set) => ({
  activeBorrower: null,
  activeTab: 'New',
  setActiveBorrower: (borrower) => set({ activeBorrower: borrower }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));