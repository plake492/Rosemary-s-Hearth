import { create } from 'zustand';

interface LayoutState {
  headerHeight: number;
  setHeaderHeight: (h: number) => void;
  footerHeight: number;
  setFooterHeight: (h: number) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  headerHeight: 0,
  setHeaderHeight: (h) => set({ headerHeight: h }),
  footerHeight: 0,
  setFooterHeight: (h) => set({ footerHeight: h }),
}));
